import { describe, it, expect, vi } from "vitest"
import { ModeStore } from "./mode-store"

describe("ModeStore", () => {
  it("初期状態は'edit'", () => {
    const store = new ModeStore()
    expect(store.getMode()).toBe("edit")
  })

  it("setModeで'preview'に変更できる", () => {
    const store = new ModeStore()
    store.setMode("preview")
    expect(store.getMode()).toBe("preview")
  })

  it("setModeで'edit'に戻せる", () => {
    const store = new ModeStore()
    store.setMode("preview")
    store.setMode("edit")
    expect(store.getMode()).toBe("edit")
  })

  it("toggleでedit→preview→editと切り替わる", () => {
    const store = new ModeStore()
    store.toggle()
    expect(store.getMode()).toBe("preview")
    store.toggle()
    expect(store.getMode()).toBe("edit")
  })

  it("setModeでリスナーが呼ばれる", () => {
    const store = new ModeStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.setMode("preview")
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("同値setModeではリスナーが呼ばれない", () => {
    const store = new ModeStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.setMode("edit")
    expect(listener).not.toHaveBeenCalled()
  })

  it("toggleでリスナーが呼ばれる", () => {
    const store = new ModeStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.toggle()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("unsubscribeでリスナーが解除される", () => {
    const store = new ModeStore()
    const listener = vi.fn()
    const unsub = store.subscribe(listener)
    unsub()
    store.setMode("preview")
    expect(listener).not.toHaveBeenCalled()
  })
})
