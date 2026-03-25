import Yoga, { FlexDirection, Edge, Gutter, Direction, Align, Justify } from "yoga-layout"
import type { LayoutDocument, LayoutNode, LayoutSettings } from "./layout-parser"

export type ResolvedNode = {
  node: LayoutNode
  x: number
  y: number
  w: number
  h: number
  children?: ResolvedNode[]
}

function fractionToPercent(ratio: string): number | null {
  if (ratio === "1/2") return 50
  if (ratio === "1/3") return 100 / 3
  if (ratio === "2/3") return 200 / 3
  if (ratio === "1/4") return 25
  if (ratio === "3/4") return 75
  return null
}

function mapAlignItems(v?: string): number {
  if (v === "start") return Align.FlexStart
  if (v === "center") return Align.Center
  if (v === "end") return Align.FlexEnd
  if (v === "stretch") return Align.Stretch
  return Align.Stretch
}

function mapJustifyContent(v?: string): number {
  if (v === "start") return Justify.FlexStart
  if (v === "center") return Justify.Center
  if (v === "end") return Justify.FlexEnd
  if (v === "space-between") return Justify.SpaceBetween
  if (v === "space-around") return Justify.SpaceAround
  if (v === "space-evenly") return Justify.SpaceEvenly
  return Justify.FlexStart
}

function applyNodeSizing(yn: ReturnType<typeof Yoga.Node.create>, node: LayoutNode, remSize: number): void {
  if (node.sizing === "ratio") {
    const percentW = fractionToPercent(node.ratioW)
    const percentH = fractionToPercent(node.ratioH)
    if (percentW !== null) yn.setWidthPercent(percentW)
    if (percentH !== null) yn.setHeightPercent(percentH)
    yn.setFlexGrow(0)
    yn.setFlexShrink(0)
  } else if (node.sizing === "rem") {
    yn.setWidth(node.remW * remSize)
    yn.setHeight(node.remH * remSize)
    yn.setFlexGrow(0)
    yn.setFlexShrink(0)
  } else {
    yn.setFlexGrow(1)
  }
}

function buildYogaTree(node: LayoutNode, settings: LayoutSettings, remSize: number): ReturnType<typeof Yoga.Node.create> {
  const yn = Yoga.Node.create()

  applyNodeSizing(yn, node, remSize)

  if (node.type === "layout") {
    yn.setFlexDirection(node.direction === "horizontal" ? FlexDirection.Row : FlexDirection.Column)
    yn.setPadding(Edge.All, settings.padding)
    yn.setGap(Gutter.All, settings.gap)
    yn.setAlignItems(mapAlignItems(settings.alignItems))
    yn.setJustifyContent(mapJustifyContent(settings.justifyContent))

    node.children.forEach((child, i) => {
      const childYn = buildYogaTree(child, settings, remSize)
      yn.insertChild(childYn, i)
    })
  }

  return yn
}

function extractResolved(yn: ReturnType<typeof Yoga.Node.create>, node: LayoutNode): ResolvedNode {
  const x = yn.getComputedLeft()
  const y = yn.getComputedTop()
  const w = yn.getComputedWidth()
  const h = yn.getComputedHeight()

  if (node.type === "layout") {
    const children: ResolvedNode[] = node.children.map((child, i) =>
      extractResolved(yn.getChild(i), child)
    )
    return { node, x, y, w, h, children }
  }

  return { node, x, y, w, h }
}

function freeYogaTree(yn: ReturnType<typeof Yoga.Node.create>): void {
  for (let i = yn.getChildCount() - 1; i >= 0; i--) {
    const child = yn.getChild(i)
    yn.removeChild(child)
    freeYogaTree(child)
  }
  yn.free()
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function pxToFraction(px: number, containerPx: number): string {
  const ratio = px / containerPx
  const knownFractions: [number, string][] = [
    [1/4, "1/4"], [1/3, "1/3"], [1/2, "1/2"],
    [2/3, "2/3"], [3/4, "3/4"], [1/1, "1/1"],
  ]
  for (const [value, label] of knownFractions) {
    if (Math.abs(ratio - value) < 0.01) return label
  }
  const percent = Math.round(ratio * 100)
  const d = gcd(percent, 100)
  return `${percent / d}/${100 / d}`
}

export function computeLayout(doc: LayoutDocument, containerW: number, containerH: number, remSize: number = 16): ResolvedNode {
  const rootYn = buildYogaTree(doc.node, doc.settings, remSize)

  rootYn.calculateLayout(containerW, containerH, Direction.LTR)
  const result = extractResolved(rootYn, doc.node)

  freeYogaTree(rootYn)
  return result
}
