import type { Widget, HandleSide } from "../types"
import { snap, GRID_SIZE } from "./snap"

export interface ResizeState {
  widgetId: string; side: HandleSide
  startMouseX: number; startMouseY: number
  startX: number; startY: number; startWidth: number; startHeight: number
}

export function beginResize(widget: Widget, side: HandleSide, mouseX: number, mouseY: number): ResizeState {
  return {
    widgetId: widget.id, side,
    startMouseX: mouseX, startMouseY: mouseY,
    startX: widget.x, startY: widget.y, startWidth: widget.width, startHeight: widget.height,
  }
}

export function moveResize(state: ResizeState, mouseX: number, mouseY: number): { x: number; y: number; width: number; height: number } {
  const dx = mouseX - state.startMouseX
  const dy = mouseY - state.startMouseY
  let x = state.startX, y = state.startY, width = state.startWidth, height = state.startHeight

  switch (state.side) {
    case "right":  width = snap(state.startWidth + dx); break
    case "left":   { const newLeft = snap(state.startX + dx); width = state.startX + state.startWidth - newLeft; x = newLeft; break }
    case "bottom": height = snap(state.startHeight + dy); break
    case "top":    { const newTop = snap(state.startY + dy); height = state.startY + state.startHeight - newTop; y = newTop; break }
  }

  if (width < GRID_SIZE) { if (state.side === "left") x = state.startX + state.startWidth - GRID_SIZE; width = GRID_SIZE }
  if (height < GRID_SIZE) { if (state.side === "top") y = state.startY + state.startHeight - GRID_SIZE; height = GRID_SIZE }
  return { x, y, width, height }
}
