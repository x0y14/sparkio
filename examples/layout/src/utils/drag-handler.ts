export interface LayoutDragState {
  sourcePath: string
  sourceNodeId: string
  startMouseX: number
  startMouseY: number
  startNodeX: number
  startNodeY: number
}

export function beginLayoutDrag(
  sourcePath: string, sourceNodeId: string,
  mouseX: number, mouseY: number,
  nodeX: number, nodeY: number,
): LayoutDragState {
  return { sourcePath, sourceNodeId, startMouseX: mouseX, startMouseY: mouseY, startNodeX: nodeX, startNodeY: nodeY }
}

export function computeDragPosition(
  state: LayoutDragState,
  currentMouseX: number,
  currentMouseY: number,
): { x: number; y: number } {
  return {
    x: state.startNodeX + (currentMouseX - state.startMouseX),
    y: state.startNodeY + (currentMouseY - state.startMouseY),
  }
}
