import { describe, it, expect } from "vitest"
import { createClipboard, copyWidget, pasteWidget } from "./clipboard"
import type { Widget } from "../types"

const w: Widget = { id: "a", kind: "ui-button", x: 100, y: 80, width: 120, height: 40, props: { variant: "solid" }, content: "Click" }

describe("clipboard", () => {
  it("初期状態でpasteはnull", () => {
    expect(pasteWidget(createClipboard(), 0, 0)).toBeNull()
  })
  it("copyしてpasteでウィジェットデータを返す", () => {
    const cb = createClipboard()
    copyWidget(cb, w)
    const result = pasteWidget(cb, 40, 60)!
    expect(result.kind).toBe("ui-button")
    expect(result.width).toBe(120)
    expect(result.height).toBe(40)
    expect(result.props).toEqual({ variant: "solid" })
    expect(result.content).toBe("Click")
    expect(result.x).toBe(40)
    expect(result.y).toBe(60)
  })
  it("pasteのx,yはスナップされる", () => {
    const cb = createClipboard()
    copyWidget(cb, w)
    const result = pasteWidget(cb, 35, 55)!
    expect(result.x).toBe(40)
    expect(result.y).toBe(60)
  })
  it("copyはpropsの参照を共有しない(ディープコピー)", () => {
    const cb = createClipboard()
    copyWidget(cb, w)
    w.props.variant = "outline"
    const result = pasteWidget(cb, 0, 0)!
    expect(result.props.variant).toBe("solid")
    w.props.variant = "solid" // restore
  })
})
