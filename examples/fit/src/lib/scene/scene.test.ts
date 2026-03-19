import { describe, it, expect } from "vitest"
import { Scene } from "./scene"
import { WidgetStore } from "../widgets/widget-store"

describe("Scene", () => {
  function createContainer(): HTMLDivElement {
    const div = document.createElement("div")
    Object.defineProperty(div, "getBoundingClientRect", {
      value: () => ({ x: 0, y: 0, width: 800, height: 600, top: 0, right: 800, bottom: 600, left: 0, toJSON() {} }),
    })
    document.body.appendChild(div)
    return div
  }

  it("コンストラクタが例外なく完了する", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.destroy()
  })

  it("addWidgetでウィジェットが追加される", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    expect(store.getAll()).toHaveLength(1)
    expect(store.getSelectedId()).not.toBeNull()
    scene.destroy()
  })

  it("addWidgetで追加されたウィジェットのサイズはスナップ済み", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    const w = store.getAll()[0]
    expect(w.x % 20).toBe(0)
    expect(w.y % 20).toBe(0)
    expect(w.width % 20).toBe(0)
    expect(w.height % 20).toBe(0)
    scene.destroy()
  })

  it("syncでDOM要素が生成される", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    // store.addの通知でsyncが呼ばれる
    const wrappers = container.querySelectorAll("[data-widget-id]")
    expect(wrappers.length).toBe(1)
    scene.destroy()
  })

  it("removeでDOM要素が削除される", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    const id = store.getAll()[0].id
    store.remove(id)
    const wrappers = container.querySelectorAll("[data-widget-id]")
    expect(wrappers.length).toBe(0)
    scene.destroy()
  })

  it("選択時に選択オーバーレイが表示される", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    const overlay = container.querySelector(".selection-overlay")
    expect(overlay).not.toBeNull()
    scene.destroy()
  })

  it("選択解除で選択オーバーレイが非表示になる", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    store.select(null)
    const overlay = container.querySelector(".selection-overlay")
    expect(overlay).toBeNull()
    scene.destroy()
  })

  it("destroyが例外なく完了する", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.destroy()
  })

  it("初期モードは'edit'", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    expect(scene.getMode()).toBe("edit")
    scene.destroy()
  })

  it("fit:mode-changeイベントでモードが切り替わる", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    window.dispatchEvent(new CustomEvent("fit:mode-change", { detail: { mode: "preview" } }))
    expect(scene.getMode()).toBe("preview")
    scene.destroy()
  })

  it("editモード: widgetコンポーネントのpointerEventsが'none'", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    const wrapper = container.querySelector("[data-widget-id]")!
    const component = wrapper.querySelector("ui-button") as HTMLElement
    expect(component.style.pointerEvents).toBe("none")
    scene.destroy()
  })

  it("previewモード: widgetコンポーネントのpointerEventsが'auto'", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    window.dispatchEvent(new CustomEvent("fit:mode-change", { detail: { mode: "preview" } }))
    const wrapper = container.querySelector("[data-widget-id]")!
    const component = wrapper.querySelector("ui-button") as HTMLElement
    expect(component.style.pointerEvents).toBe("auto")
    scene.destroy()
  })

  it("previewモード: 選択オーバーレイが表示されない", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    // editではオーバーレイあり
    expect(container.querySelector(".selection-overlay")).not.toBeNull()
    window.dispatchEvent(new CustomEvent("fit:mode-change", { detail: { mode: "preview" } }))
    expect(container.querySelector(".selection-overlay")).toBeNull()
    scene.destroy()
  })

  it("previewモード→editモードに戻すとpointerEventsが'none'に戻る", () => {
    const store = new WidgetStore()
    const container = createContainer()
    const scene = new Scene(container, store)
    scene.addWidget("ui-button")
    window.dispatchEvent(new CustomEvent("fit:mode-change", { detail: { mode: "preview" } }))
    window.dispatchEvent(new CustomEvent("fit:mode-change", { detail: { mode: "edit" } }))
    const wrapper = container.querySelector("[data-widget-id]")!
    const component = wrapper.querySelector("ui-button") as HTMLElement
    expect(component.style.pointerEvents).toBe("none")
    scene.destroy()
  })
})
