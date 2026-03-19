import { describe, it, expect, beforeAll } from "vitest"

describe("fit-properties", () => {
  beforeAll(async () => {
    await import("../fit-properties.js")
    await customElements.whenDefined("fit-properties")
  })

  function create(): HTMLElement {
    const el = document.createElement("fit-properties")
    document.body.appendChild(el)
    return el
  }

  it("カスタムエレメントが登録される", () => {
    expect(customElements.get("fit-properties")).toBeDefined()
  })

  it(".panel要素が存在し初期状態でcollapsedでない", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const panel = el.shadowRoot!.querySelector(".panel")
    expect(panel).not.toBeNull()
    expect(panel!.classList.contains("collapsed")).toBe(false)
  })

  it("Properties, Widget, Position, Sizeセクションが存在する", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const text = el.shadowRoot!.innerHTML
    expect(text).toContain("Properties")
    expect(text).toContain("Widget")
    expect(text).toContain("Position")
    expect(text).toContain("Size")
  })

  it("トグルボタンクリックでcollapsedクラスが付与される", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const btn = el.shadowRoot!.querySelector(".toggle-btn") as HTMLElement
    btn.click()
    await new Promise(r => setTimeout(r, 100))
    const panel = el.shadowRoot!.querySelector(".panel")
    expect(panel!.classList.contains("collapsed")).toBe(true)
  })

  it("再度クリックでcollapsedが解除される", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const btn = el.shadowRoot!.querySelector(".toggle-btn") as HTMLElement
    btn.click()
    await new Promise(r => setTimeout(r, 100))
    btn.click()
    await new Promise(r => setTimeout(r, 100))
    const panel = el.shadowRoot!.querySelector(".panel")
    expect(panel!.classList.contains("collapsed")).toBe(false)
  })
})
