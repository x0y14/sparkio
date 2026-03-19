import { describe, it, expect, beforeAll } from "vitest"

describe("fit-canvas", () => {
  beforeAll(async () => {
    await import("../fit-canvas.js")
    await customElements.whenDefined("fit-canvas")
  })

  function create(): HTMLElement {
    const el = document.createElement("fit-canvas")
    document.body.appendChild(el)
    return el
  }

  it("カスタムエレメントが登録される", () => {
    expect(customElements.get("fit-canvas")).toBeDefined()
  })

  it(".canvas-container要素が存在する", async () => {
    const el = create()
    await new Promise(r => setTimeout(r, 50))
    const container = el.shadowRoot!.querySelector(".canvas-container")
    expect(container).not.toBeNull()
  })
})
