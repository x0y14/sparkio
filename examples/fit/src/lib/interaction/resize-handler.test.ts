import { describe, it, expect } from "vitest"
import { beginResize, moveResize } from "./resize-handler"
import { GRID_SIZE } from "./snap"
import type { Widget } from "../types"

const w: Widget = { id: "a", kind: "ui-button", x: 100, y: 100, width: 100, height: 80, props: {}, content: "" }

describe("moveResize", () => {
  it("right: 右辺を30px右に → 幅が増える", () => {
    const state = beginResize(w, "right", 200, 140)
    const r = moveResize(state, 230, 140)
    expect(r).toEqual({ x: 100, y: 100, width: 140, height: 80 })
  })
  it("left: 左辺を30px左に → 幅が増え、xが減る", () => {
    const state = beginResize(w, "left", 100, 140)
    const r = moveResize(state, 70, 140)
    expect(r).toEqual({ x: 80, y: 100, width: 120, height: 80 })
  })
  it("top: 上辺を25px上に → 高さが増え、yが減る", () => {
    const state = beginResize(w, "top", 150, 100)
    const r = moveResize(state, 150, 75)
    expect(r).toEqual({ x: 100, y: 80, width: 100, height: 100 })
  })
  it("bottom: 下辺を30px下に → 高さが増える", () => {
    const state = beginResize(w, "bottom", 150, 180)
    const r = moveResize(state, 150, 210)
    expect(r).toEqual({ x: 100, y: 100, width: 100, height: 120 })
  })
  it("最小サイズはGRID_SIZE", () => {
    const state = beginResize(w, "right", 200, 140)
    expect(moveResize(state, 110, 140).width).toBe(GRID_SIZE)
  })
  it("top: 最小サイズ制約", () => {
    const state = beginResize(w, "top", 150, 100)
    expect(moveResize(state, 150, 175).height).toBe(GRID_SIZE)
  })
})
