import { describe, it, expect } from "vitest"
import { findDropTarget, buildLayoutGeometry } from "../src/utils/drop-target"
import { computeLayout } from "../src/utils/compute-layout"
import type { LayoutDocument } from "../src/utils/layout-parser"

const doc: LayoutDocument = {
  settings: { gap: 8, padding: 8 },
  node: {
    type: "layout", direction: "vertical", sizing: "auto", children: [
      { type: "item", id: "a", sizing: "auto" },
      { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "item", id: "b", sizing: "auto" },
        { type: "item", id: "c", sizing: "auto" },
      ]},
      { type: "item", id: "d", sizing: "auto" },
    ],
  },
}

const CW = 1000
const CH = 800

describe("buildLayoutGeometry", () => {
  it("ルートLayoutのジオメトリを返す", () => {
    const resolved = computeLayout(doc, CW, CH)
    const geoms = buildLayoutGeometry(resolved)
    const root = geoms.find(g => g.path === "")!
    expect(root.rect.x).toBe(0)
    expect(root.rect.y).toBe(0)
    expect(root.rect.width).toBe(CW)
    expect(root.rect.height).toBe(CH)
    expect(root.direction).toBe("vertical")
    expect(root.childRects).toHaveLength(3)
  })

  it("ネストしたLayoutのジオメトリを返す", () => {
    const resolved = computeLayout(doc, CW, CH)
    const geoms = buildLayoutGeometry(resolved)
    const nested = geoms.find(g => g.path === "1")!
    expect(nested.direction).toBe("horizontal")
    expect(nested.childRects).toHaveLength(2)
  })
})

describe("findDropTarget", () => {
  it("vertical layout: 上部→index 0", () => {
    const resolved = computeLayout(doc, CW, CH)
    const geoms = buildLayoutGeometry(resolved)
    const result = findDropTarget(geoms, CW / 2, 10, "2")
    expect(result).not.toBeNull()
    expect(result!.targetPath).toBe("")
    expect(result!.insertIndex).toBe(0)
  })

  it("ネストしたlayoutを優先", () => {
    const resolved = computeLayout(doc, CW, CH)
    const geoms = buildLayoutGeometry(resolved)
    const nested = geoms.find(g => g.path === "1")!
    const midX = nested.rect.x + nested.rect.width / 2
    const midY = nested.rect.y + nested.rect.height / 2
    const result = findDropTarget(geoms, midX, midY, "2")
    expect(result!.targetPath).toBe("1")
  })

  it("マウスが全layout外→null", () => {
    const resolved = computeLayout(doc, CW, CH)
    const geoms = buildLayoutGeometry(resolved)
    expect(findDropTarget(geoms, CW + 100, CH + 100, "0")).toBeNull()
  })
})
