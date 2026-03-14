import { describe, test, expect, afterEach } from "vitest"
import clientDirective from "../src/client.js"

describe("client directive", () => {
  afterEach(() => {
    // Clean up _propsSchema set on HTMLDivElement by schema tests
    delete (HTMLDivElement as any)._propsSchema
  })
  // --- schema ありの場合: allowlist として動作 ---

  test("schema あり: _propsSchema に定義された prop は設定される", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div") as any
    Object.defineProperty(sparkleEl, "count", {
      value: 0,
      writable: true,
      configurable: true,
    })
    sparkleEl.constructor._propsSchema = { count: { type: Number } }
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await hydrate(null, { count: 42 }, {})

    expect(sparkleEl.count).toBe(42)
  })

  test("schema あり: _propsSchema に定義されていない prop は拒否される", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div") as any
    Object.defineProperty(sparkleEl, "innerHTML", {
      value: "",
      writable: true,
      configurable: true,
    })
    sparkleEl.constructor._propsSchema = { count: { type: Number } }
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await hydrate(null, { innerHTML: "evil" }, {})

    expect(sparkleEl.innerHTML).toBe("")
  })

  test("schema あり: Object/Array props が正しく渡される", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div") as any
    Object.defineProperty(sparkleEl, "items", {
      value: [],
      writable: true,
      configurable: true,
    })
    Object.defineProperty(sparkleEl, "config", {
      value: {},
      writable: true,
      configurable: true,
    })
    sparkleEl.constructor._propsSchema = {
      items: { type: Array },
      config: { type: Object },
    }
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await hydrate(null, { items: [1, 2, 3], config: { theme: "dark" } }, {})

    expect(sparkleEl.items).toEqual([1, 2, 3])
    expect(sparkleEl.config).toEqual({ theme: "dark" })
  })

  test("schema あり: firstElementChild がない場合は element 自体に設定する", async () => {
    const island = document.createElement("div") as any
    Object.defineProperty(island, "count", {
      value: 0,
      writable: true,
      configurable: true,
    })
    island.constructor._propsSchema = { count: { type: Number } }

    const hydrate = clientDirective(island)
    await hydrate(null, { count: 99 }, {})

    expect(island.count).toBe(99)
  })

  // --- schema なしの場合: 全 props ブロック ---

  test("schema なし: どの prop も設定されない", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div") as any
    Object.defineProperty(sparkleEl, "count", {
      value: 0,
      writable: true,
      configurable: true,
    })
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await hydrate(null, { count: 42 }, {})

    expect(sparkleEl.count).toBe(0)
  })

  test("schema なし: innerHTML も設定されない", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div")
    island.appendChild(sparkleEl)

    const originalInnerHTML = sparkleEl.innerHTML
    const hydrate = clientDirective(island)
    await hydrate(null, { innerHTML: '<img onerror="alert(1)">' }, {})

    expect(sparkleEl.innerHTML).toBe(originalInnerHTML)
  })

  test("schema なし: コンポーネント上に存在する prop でも設定されない", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div") as any
    sparkleEl.onclick = null
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await hydrate(null, { onclick: () => alert("xss") }, {})

    expect(sparkleEl.onclick).toBeNull()
  })

  // --- エッジケース ---

  test("props が空オブジェクトの場合はエラーにならない", async () => {
    const island = document.createElement("div")
    const sparkleEl = document.createElement("div")
    island.appendChild(sparkleEl)

    const hydrate = clientDirective(island)
    await expect(hydrate(null, {}, {})).resolves.not.toThrow()
  })
})
