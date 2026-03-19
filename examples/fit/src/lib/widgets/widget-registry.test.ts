import { describe, it, expect } from "vitest"
import { getRegistry, getEntry, type WidgetCatalogEntry } from "./widget-registry"
import { GRID_SIZE } from "../interaction/snap"

describe("widget-registry", () => {
  it("10件のカタログエントリを返す", () => {
    expect(getRegistry()).toHaveLength(10)
  })

  it("全エントリがlabelを持つ", () => {
    for (const entry of getRegistry()) {
      expect(entry.label.length).toBeGreaterThan(0)
    }
  })

  it("全エントリのdefaultWidthがGRID_SIZEの倍数", () => {
    for (const entry of getRegistry()) {
      expect(entry.defaultWidth % GRID_SIZE).toBe(0)
    }
  })

  it("全エントリのdefaultHeightがGRID_SIZEの倍数", () => {
    for (const entry of getRegistry()) {
      expect(entry.defaultHeight % GRID_SIZE).toBe(0)
    }
  })

  it("getEntryで既知のkindを取得できる", () => {
    expect(getEntry("ui-button")).toBeDefined()
    expect(getEntry("ui-button")!.label).toBe("Button")
  })

  it("getEntryで未知のkindはundefined", () => {
    expect(getEntry("ui-unknown" as any)).toBeUndefined()
  })

  it("kindの重複がない", () => {
    const kinds = getRegistry().map(e => e.kind)
    expect(new Set(kinds).size).toBe(kinds.length)
  })
})
