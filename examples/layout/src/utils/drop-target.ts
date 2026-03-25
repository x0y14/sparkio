import { isAncestorPath } from "./tree-ops"
import type { ResolvedNode } from "./compute-layout"

export interface LayoutGeometry {
  path: string
  rect: { x: number; y: number; width: number; height: number }
  direction: "vertical" | "horizontal"
  childRects: { path: string; rect: { x: number; y: number; width: number; height: number } }[]
}

export interface DropResult {
  targetPath: string
  insertIndex: number
}

function containsPoint(rect: { x: number; y: number; width: number; height: number }, mx: number, my: number): boolean {
  return mx >= rect.x && mx <= rect.x + rect.width && my >= rect.y && my <= rect.y + rect.height
}

export function findDropTarget(
  layouts: LayoutGeometry[],
  mouseX: number,
  mouseY: number,
  sourcePath: string | null,
): DropResult | null {
  const sorted = [...layouts].sort((a, b) => b.path.length - a.path.length)

  for (const layout of sorted) {
    if (!containsPoint(layout.rect, mouseX, mouseY)) continue
    if (sourcePath !== null && (layout.path === sourcePath || isAncestorPath(sourcePath, layout.path))) continue

    let insertIndex = layout.childRects.length
    for (let i = 0; i < layout.childRects.length; i++) {
      const child = layout.childRects[i]
      const mid = layout.direction === "vertical"
        ? child.rect.y + child.rect.height / 2
        : child.rect.x + child.rect.width / 2
      const mousePos = layout.direction === "vertical" ? mouseY : mouseX
      if (mousePos < mid) {
        insertIndex = i
        break
      }
    }
    return { targetPath: layout.path, insertIndex }
  }
  return null
}

export function buildLayoutGeometry(resolved: ResolvedNode, path: string = "", offsetX: number = 0, offsetY: number = 0): LayoutGeometry[] {
  if (resolved.node.type !== "layout") return []

  const absX = offsetX + resolved.x
  const absY = offsetY + resolved.y
  const rect = { x: absX, y: absY, width: resolved.w, height: resolved.h }
  const childRects: LayoutGeometry["childRects"] = []
  let nested: LayoutGeometry[] = []

  if (resolved.children) {
    resolved.children.forEach((child, i) => {
      const childPath = path === "" ? `${i}` : `${path}.${i}`
      const childAbsX = absX + child.x
      const childAbsY = absY + child.y
      childRects.push({
        path: childPath,
        rect: { x: childAbsX, y: childAbsY, width: child.w, height: child.h },
      })
      if (child.node.type === "layout") {
        nested = nested.concat(buildLayoutGeometry(child, childPath, absX, absY))
      }
    })
  }

  return [{ path, rect, direction: resolved.node.direction, childRects }, ...nested]
}
