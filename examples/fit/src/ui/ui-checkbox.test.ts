import { describe, it, expect, afterEach } from "vitest"
import { createElement, sq, cleanup } from "./test-helpers"
import "./ui-checkbox"

describe("ui-checkbox", () => {
  let el: HTMLElement
  afterEach(() => { if (el) cleanup(el) })

  it("renders label element", async () => {
    el = await createElement("ui-checkbox")
    expect(sq(el, "label")).not.toBeNull()
  })

  it("not selected by default", async () => {
    el = await createElement("ui-checkbox")
    expect(sq(el, "[data-check] svg")).toBeNull()
  })

  it("selected shows check icon", async () => {
    el = await createElement("ui-checkbox", { "is-selected": "" })
    expect(sq(el, "[data-check] svg")).not.toBeNull()
  })

  it("disabled state", async () => {
    el = await createElement("ui-checkbox", { "is-disabled": "" })
    expect(sq(el, "label")!.className).toContain("opacity-50")
  })

  it("color primary when selected", async () => {
    el = await createElement("ui-checkbox", { "is-selected": "", color: "primary" })
    expect(sq(el, "[data-check]")!.className).toContain("bg-primary")
  })

  it("clicking toggles isSelected", async () => {
    el = await createElement("ui-checkbox")
    expect(sq(el, "[data-check] svg")).toBeNull()
    ;(sq(el, "label") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(sq(el, "[data-check] svg")).not.toBeNull()
  })

  it("clicking selected checkbox deselects it", async () => {
    el = await createElement("ui-checkbox", { "is-selected": "" })
    expect(sq(el, "[data-check] svg")).not.toBeNull()
    ;(sq(el, "label") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(sq(el, "[data-check] svg")).toBeNull()
  })

  it("dispatches change event with toggled value", async () => {
    el = await createElement("ui-checkbox")
    let detail: any = null
    el.addEventListener("change", (e) => { detail = (e as CustomEvent).detail })
    ;(sq(el, "label") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(detail).toEqual({ selected: true })
  })
})
