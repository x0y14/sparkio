import { describe, it, expect, beforeAll, vi } from "vitest"

describe("fit-palette", () => {
  beforeAll(async () => {
    await import("../fit-palette.js")
    await customElements.whenDefined("fit-palette")
  })

  function create(): HTMLElement {
    const el = document.createElement("fit-palette")
    document.body.appendChild(el)
    return el
  }

  it("カスタムエレメントが登録される", () => {
    expect(customElements.get("fit-palette")).toBeDefined()
  })

  it("パレットアイテムが10個ある", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const items = el.shadowRoot!.querySelectorAll(".palette-item")
    expect(items.length).toBe(10)
  })

  it("各アイテムにdata-kindが設定されている", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const items = el.shadowRoot!.querySelectorAll(".palette-item")
    for (const item of items) {
      expect((item as HTMLElement).dataset.kind).toBeTruthy()
    }
  })

  it("アイテムクリックでfit:add-widgetイベントが発火する", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 100))
    const handler = vi.fn()
    window.addEventListener("fit:add-widget", handler)
    try {
      const item = el.shadowRoot!.querySelector('.palette-item') as HTMLElement
      item?.click()
      await new Promise(r => setTimeout(r, 50))
      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0][0].detail.kind).toBeTruthy()
    } finally {
      window.removeEventListener("fit:add-widget", handler)
    }
  })
})
