import { describe, it, expect } from "vitest"
import { hitTest, HANDLE_SIZE } from "./hit-test"
import type { Widget } from "../types"

const w1: Widget = { id: "a", kind: "ui-button", x: 100, y: 100, width: 100, height: 80, props: {}, content: "" }
const w2: Widget = { id: "b", kind: "ui-card",   x: 150, y: 130, width: 100, height: 80, props: {}, content: "" }

describe("hitTest", () => {
  it("ウィジェットなしでcanvasを返す", () => {
    expect(hitTest([], null, 50, 50)).toEqual({ kind: "canvas" })
  })
  it("ウィジェット内部をクリックでwidgetを返す", () => {
    expect(hitTest([w1], null, 150, 140)).toEqual({ kind: "widget", widgetId: "a" })
  })
  it("ウィジェット外部でcanvasを返す", () => {
    expect(hitTest([w1], null, 50, 50)).toEqual({ kind: "canvas" })
  })
  it("重なりでは後ろ(z-order上位)のウィジェットが優先される", () => {
    expect(hitTest([w1, w2], null, 170, 150)).toEqual({ kind: "widget", widgetId: "b" })
  })
  it("選択ウィジェットのtopハンドルにヒットする", () => {
    expect(hitTest([w1], "a", 150, 100)).toEqual({ kind: "handle", widgetId: "a", side: "top" })
  })
  it("選択ウィジェットのrightハンドルにヒットする", () => {
    expect(hitTest([w1], "a", 200, 140)).toEqual({ kind: "handle", widgetId: "a", side: "right" })
  })
  it("選択ウィジェットのbottomハンドルにヒットする", () => {
    expect(hitTest([w1], "a", 150, 180)).toEqual({ kind: "handle", widgetId: "a", side: "bottom" })
  })
  it("選択ウィジェットのleftハンドルにヒットする", () => {
    expect(hitTest([w1], "a", 100, 140)).toEqual({ kind: "handle", widgetId: "a", side: "left" })
  })
  it("ハンドルはウィジェット本体より優先される", () => {
    expect(hitTest([w1], "a", 150, 100).kind).toBe("handle")
  })
  it("非選択ウィジェットのハンドルはチェックされない", () => {
    expect(hitTest([w1], null, 150, 100)).toEqual({ kind: "widget", widgetId: "a" })
  })
})
