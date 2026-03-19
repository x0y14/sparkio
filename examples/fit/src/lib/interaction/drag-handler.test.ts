import { describe, it, expect } from "vitest"
import { beginDrag, moveDrag } from "./drag-handler"
import type { Widget } from "../types"

const w: Widget = { id: "a", kind: "ui-button", x: 100, y: 80, width: 120, height: 40, props: {}, content: "" }

describe("beginDrag", () => {
  it("初期状態を正しく記録する", () => {
    const state = beginDrag(w, 120, 100)
    expect(state.widgetId).toBe("a")
    expect(state.startMouseX).toBe(120)
    expect(state.startMouseY).toBe(100)
    expect(state.startWidgetX).toBe(100)
    expect(state.startWidgetY).toBe(80)
  })
})

describe("moveDrag", () => {
  const state = beginDrag(w, 120, 100)
  it("マウス移動なしでは元の位置(スナップ済)を返す", () => {
    expect(moveDrag(state, 120, 100)).toEqual({ x: 100, y: 80 })
  })
  it("右下に25px移動→スナップされる", () => {
    expect(moveDrag(state, 145, 125)).toEqual({ x: 120, y: 100 })
  })
  it("左上に30px移動→スナップされる", () => {
    expect(moveDrag(state, 90, 70)).toEqual({ x: 80, y: 60 })
  })
})
