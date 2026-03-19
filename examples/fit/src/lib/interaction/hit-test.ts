import type { Widget, HitTarget } from "../types"
import { containsPoint, computeHandles, handleContainsPoint } from "../geometry/rect"

export const HANDLE_SIZE = 8

export function hitTest(widgets: Widget[], selectedId: string | null, px: number, py: number): HitTarget {
  if (selectedId !== null) {
    const selected = widgets.find(w => w.id === selectedId)
    if (selected) {
      const handles = computeHandles(selected, HANDLE_SIZE)
      for (const handle of handles) {
        if (handleContainsPoint(handle.cx, handle.cy, HANDLE_SIZE, px, py)) {
          return { kind: "handle", widgetId: selectedId, side: handle.side }
        }
      }
    }
  }
  for (let i = widgets.length - 1; i >= 0; i--) {
    const w = widgets[i]
    if (containsPoint(w, px, py)) {
      return { kind: "widget", widgetId: w.id }
    }
  }
  return { kind: "canvas" }
}
