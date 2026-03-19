import { describe, it, expect, afterEach } from "vitest"
import { createElement, sq, cleanup } from "./test-helpers"
import "./ui-switch"

describe("ui-switch", () => {
  let el: HTMLElement
  afterEach(() => { if (el) cleanup(el) })

  it("renders button with role=switch", async () => {
    el = await createElement("ui-switch")
    expect(sq(el, "[role='switch']")).not.toBeNull()
  })

  it("aria-checked=false by default", async () => {
    el = await createElement("ui-switch")
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("false")
  })

  it("aria-checked=true when selected", async () => {
    el = await createElement("ui-switch", { "is-selected": "" })
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("true")
  })

  it("disabled state", async () => {
    el = await createElement("ui-switch", { "is-disabled": "" })
    expect(sq(el, "label")!.className).toContain("opacity-50")
  })

  it("color primary when selected", async () => {
    el = await createElement("ui-switch", { "is-selected": "", color: "primary" })
    expect(sq(el, "[role='switch']")!.className).toContain("bg-primary")
  })

  it("clicking toggles isSelected", async () => {
    el = await createElement("ui-switch")
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("false")
    ;(sq(el, "[role='switch']") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("true")
  })

  it("clicking selected switch deselects it", async () => {
    el = await createElement("ui-switch", { "is-selected": "" })
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("true")
    ;(sq(el, "[role='switch']") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(sq(el, "[role='switch']")!.getAttribute("aria-checked")).toBe("false")
  })

  it("dispatches change event with toggled value", async () => {
    el = await createElement("ui-switch")
    let detail: any = null
    el.addEventListener("change", (e) => { detail = (e as CustomEvent).detail })
    ;(sq(el, "[role='switch']") as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 0))
    expect(detail).toEqual({ selected: true })
  })
})
