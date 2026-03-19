import { describe, it, expect, beforeAll, vi } from "vitest"

describe("fit-header", () => {
  beforeAll(async () => {
    await import("../fit-header.js")
    await customElements.whenDefined("fit-header")
  })

  function create(): HTMLElement {
    const el = document.createElement("fit-header")
    document.body.appendChild(el)
    return el
  }

  it("カスタムエレメントが登録される", () => {
    expect(customElements.get("fit-header")).toBeDefined()
  })

  it("ロゴテキスト'Fit'が表示される", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const logo = el.shadowRoot!.querySelector(".logo")
    expect(logo?.textContent).toBe("Fit")
  })

  it("モードトグルが存在し、EditとPreviewの2ボタンがある", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const toggle = el.shadowRoot!.querySelector(".mode-toggle")
    expect(toggle).not.toBeNull()
    const buttons = toggle!.querySelectorAll("button")
    expect(buttons.length).toBe(2)
    expect(buttons[0].dataset.mode).toBe("edit")
    expect(buttons[1].dataset.mode).toBe("preview")
  })

  it("初期状態でeditボタンがactiveクラスを持つ", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const editBtn = el.shadowRoot!.querySelector('button[data-mode="edit"]')!
    const previewBtn = el.shadowRoot!.querySelector('button[data-mode="preview"]')!
    expect(editBtn.classList.contains("active")).toBe(true)
    expect(previewBtn.classList.contains("active")).toBe(false)
  })

  it("previewボタンクリックでfit:mode-changeイベントが発火し、detail.modeが'preview'", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 100))
    const handler = vi.fn()
    window.addEventListener("fit:mode-change", handler)
    try {
      const previewBtn = el.shadowRoot!.querySelector('button[data-mode="preview"]') as HTMLElement
      previewBtn.click()
      await new Promise(r => setTimeout(r, 50))
      expect(handler).toHaveBeenCalledTimes(1)
      expect((handler.mock.calls[0][0] as CustomEvent).detail.mode).toBe("preview")
    } finally {
      window.removeEventListener("fit:mode-change", handler)
    }
  })

  it("previewボタンクリック後にpreviewがactiveになりeditが非activeになる", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 100))
    const previewBtn = el.shadowRoot!.querySelector('button[data-mode="preview"]') as HTMLElement
    previewBtn.click()
    await new Promise(r => setTimeout(r, 100))
    expect(previewBtn.classList.contains("active")).toBe(true)
    const editBtn = el.shadowRoot!.querySelector('button[data-mode="edit"]') as HTMLElement
    expect(editBtn.classList.contains("active")).toBe(false)
  })

  it("editボタンクリックでfit:mode-changeイベントが発火し、detail.modeが'edit'", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 100))
    // まずpreviewに切り替え
    const previewBtn = el.shadowRoot!.querySelector('button[data-mode="preview"]') as HTMLElement
    previewBtn.click()
    await new Promise(r => setTimeout(r, 50))
    const handler = vi.fn()
    window.addEventListener("fit:mode-change", handler)
    try {
      const editBtn = el.shadowRoot!.querySelector('button[data-mode="edit"]') as HTMLElement
      editBtn.click()
      await new Promise(r => setTimeout(r, 50))
      expect(handler).toHaveBeenCalledTimes(1)
      expect((handler.mock.calls[0][0] as CustomEvent).detail.mode).toBe("edit")
    } finally {
      window.removeEventListener("fit:mode-change", handler)
    }
  })
})
