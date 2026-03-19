import type { Widget } from "../types"
import { snap } from "./snap"

export interface DragState {
  widgetId: string
  startMouseX: number; startMouseY: number
  startWidgetX: number; startWidgetY: number
}

export function beginDrag(widget: Widget, mouseX: number, mouseY: number): DragState {
  return { widgetId: widget.id, startMouseX: mouseX, startMouseY: mouseY, startWidgetX: widget.x, startWidgetY: widget.y }
}

export function moveDrag(state: DragState, mouseX: number, mouseY: number): { x: number; y: number } {
  const dx = mouseX - state.startMouseX
  const dy = mouseY - state.startMouseY
  return { x: snap(state.startWidgetX + dx), y: snap(state.startWidgetY + dy) }
}
