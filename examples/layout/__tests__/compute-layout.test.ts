import { describe, it, expect } from "vitest"
import { computeLayout, pxToFraction } from "../src/utils/compute-layout"
import type { LayoutDocument } from "../src/utils/layout-parser"

const S = { gap: 8, padding: 8 }

describe("computeLayout", () => {
  it("単一Item: コンテナ全体", () => {
    const r = computeLayout({ settings: S, node: { type: "item", id: "a", sizing: "auto" } }, 800, 600)
    expect(r.x).toBe(0)
    expect(r.w).toBe(800)
    expect(r.h).toBe(600)
  })

  it("vertical auto2つ: 均等分配", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "vertical", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "auto" },
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600)
    expect(r.children![0].h).toBe(288)
    expect(r.children![1].y).toBe(304)
  })

  it("horizontal auto2つ", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "auto" },
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600)
    expect(r.children![0].w).toBe(388)
    expect(r.children![1].x).toBe(404)
  })

  it("Item sizing=rem: 固定remサイズ (10rem=160px)", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "rem", remW: 10, remH: 5 },
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBe(160)
  })

  it("Item sizing=ratio ratioW='1/3'", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "ratio", ratioW: "1/3", ratioH: "1/1" },
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBeLessThan(r.children![1].w)
  })

  it("Item sizing=ratio ratioH='1/4' in vertical", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "vertical", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "ratio", ratioW: "1/1", ratioH: "1/4" },
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].h).toBeLessThan(r.children![1].h)
  })

  it("Layout sizing=rem: 固定remサイズ (15rem=240px)", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "layout", direction: "vertical", sizing: "rem", remW: 15, remH: 10, children: [
          { type: "item", id: "a", sizing: "auto" },
        ]},
        { type: "item", id: "b", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBe(240)
  })

  it("Spacer sizing=auto: flexGrow:1", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "spacer", sizing: "auto" },
        { type: "item", id: "a", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBe(r.children![1].w)
  })

  it("Spacer sizing=ratio ratioW='1/2'", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "spacer", sizing: "ratio", ratioW: "1/2", ratioH: "1/1" },
        { type: "item", id: "a", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBeGreaterThanOrEqual(r.children![1].w)
  })

  it("Spacer sizing=rem: 固定rem (5rem=80px)", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "horizontal", sizing: "auto", children: [
        { type: "spacer", sizing: "rem", remW: 5, remH: 3 },
        { type: "item", id: "a", sizing: "auto" },
      ]},
    }, 800, 600, 16)
    expect(r.children![0].w).toBe(80)
  })

  it("alignItems=center: remアイテムがcross axis中央", () => {
    const r = computeLayout({
      settings: { gap: 8, padding: 8, alignItems: "center" },
      node: { type: "layout", direction: "vertical", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "rem", remW: 10, remH: 5 },
      ]},
    }, 500, 500, 16)
    expect(r.children![0].w).toBe(160)
    expect(r.children![0].x).toBe(170)
  })

  it("justifyContent=center: remアイテムがmain axis中央", () => {
    const r = computeLayout({
      settings: { gap: 8, padding: 8, justifyContent: "center" },
      node: { type: "layout", direction: "vertical", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "rem", remW: 10, remH: 5 },
      ]},
    }, 500, 500, 16)
    expect(r.children![0].h).toBe(80)
    expect(r.children![0].y).toBe(210)
  })

  it("ネスト再帰", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "layout", direction: "vertical", sizing: "auto", children: [
        { type: "item", id: "a", sizing: "auto" },
        { type: "layout", direction: "horizontal", sizing: "auto", children: [
          { type: "item", id: "b", sizing: "auto" },
          { type: "item", id: "c", sizing: "auto" },
        ]},
      ]},
    }, 800, 600)
    expect(r.children![1].children!.length).toBe(2)
  })

  it("ルートItem sizing=ratio: コンテナの1/4サイズ", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "item", id: "a", sizing: "ratio", ratioW: "1/4", ratioH: "1/4" },
    }, 800, 600, 16)
    expect(r.w).toBe(200)
    expect(r.h).toBe(150)
  })

  it("ルートItem sizing=rem: 固定remサイズ", () => {
    const r = computeLayout({
      settings: S,
      node: { type: "item", id: "a", sizing: "rem", remW: 10, remH: 5 },
    }, 800, 600, 16)
    expect(r.w).toBe(160)
    expect(r.h).toBe(80)
  })

  it("イミュータブル", () => {
    const doc = { settings: S, node: { type: "layout" as const, direction: "vertical" as const, sizing: "auto" as const, children: [{ type: "item" as const, id: "a", sizing: "auto" as const }] } }
    const original = JSON.stringify(doc)
    computeLayout(doc, 800, 600)
    expect(JSON.stringify(doc)).toBe(original)
  })
})

describe("pxToFraction", () => {
  it("200/800 → '1/4'", () => { expect(pxToFraction(200, 800)).toBe("1/4") })
  it("400/800 → '1/2'", () => { expect(pxToFraction(400, 800)).toBe("1/2") })
  it("600/800 → '3/4'", () => { expect(pxToFraction(600, 800)).toBe("3/4") })
  it("800/800 → '1/1'", () => { expect(pxToFraction(800, 800)).toBe("1/1") })
  it("266/800 → '1/3' (近似)", () => { expect(pxToFraction(266, 800)).toBe("1/3") })
  it("160/800 → '1/5'", () => { expect(pxToFraction(160, 800)).toBe("1/5") })
  it("240/800 → '3/10'", () => { expect(pxToFraction(240, 800)).toBe("3/10") })
})
