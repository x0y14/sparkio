import { describe, it, expect, vi } from "vitest"
import { WidgetStore } from "./widget-store"
import type { Widget } from "../types"

function makeWidget(id: string, x = 0, y = 0): Widget {
  return { id, kind: "ui-button", x, y, width: 120, height: 40, props: { variant: "solid" }, content: "Button" }
}

describe("WidgetStore", () => {
  it("初期状態は空", () => {
    const store = new WidgetStore()
    expect(store.getAll()).toEqual([])
    expect(store.getSelected()).toBeNull()
    expect(store.getSelectedId()).toBeNull()
  })

  it("addで追加、getAllで取得できる", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    expect(store.getAll()).toHaveLength(1)
    expect(store.get("a")!.id).toBe("a")
  })

  it("updateで位置を変更できる", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.update("a", { x: 50, y: 60 })
    expect(store.get("a")!.x).toBe(50)
    expect(store.get("a")!.y).toBe(60)
  })

  it("updateでpropsを変更できる", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.update("a", { props: { variant: "outline" } })
    expect(store.get("a")!.props.variant).toBe("outline")
  })

  it("updateでcontentを変更できる", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.update("a", { content: "Click" })
    expect(store.get("a")!.content).toBe("Click")
  })

  it("存在しないidのupdateは無視される", () => {
    const store = new WidgetStore()
    store.update("missing", { x: 50 })
  })

  it("removeで削除される", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.remove("a")
    expect(store.getAll()).toHaveLength(0)
    expect(store.get("a")).toBeUndefined()
  })

  it("selectで選択状態が設定される", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.select("a")
    expect(store.getSelectedId()).toBe("a")
    expect(store.getSelected()!.id).toBe("a")
  })

  it("select(null)で選択解除", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.select("a")
    store.select(null)
    expect(store.getSelectedId()).toBeNull()
    expect(store.getSelected()).toBeNull()
  })

  it("選択中のウィジェットをremoveすると選択解除される", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.select("a")
    store.remove("a")
    expect(store.getSelectedId()).toBeNull()
  })

  it("selectでウィジェットがz-order最上位に移動する", () => {
    const store = new WidgetStore()
    store.add(makeWidget("a"))
    store.add(makeWidget("b"))
    store.add(makeWidget("c"))
    store.select("a")
    const all = store.getAll()
    expect(all[all.length - 1].id).toBe("a")
  })

  it("subscribeしたリスナーがadd/update/remove/selectで呼ばれる", () => {
    const store = new WidgetStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.add(makeWidget("a"))
    expect(listener).toHaveBeenCalledTimes(1)
    store.update("a", { x: 10 })
    expect(listener).toHaveBeenCalledTimes(2)
    store.select("a")
    expect(listener).toHaveBeenCalledTimes(3)
    store.remove("a")
    expect(listener).toHaveBeenCalledTimes(4)
  })

  it("unsubscribeでリスナーが解除される", () => {
    const store = new WidgetStore()
    const listener = vi.fn()
    const unsub = store.subscribe(listener)
    unsub()
    store.add(makeWidget("a"))
    expect(listener).not.toHaveBeenCalled()
  })
})
