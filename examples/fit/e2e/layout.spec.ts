import { test, expect } from "@playwright/test"

test.describe("Fit レイアウト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForSelector("fit-header", { state: "attached" })
    await page.waitForSelector("fit-palette", { state: "attached" })
    await page.waitForSelector("fit-properties", { state: "attached" })
    await page.waitForFunction(() => {
      const header = document.querySelector("fit-header")
      const palette = document.querySelector("fit-palette")
      const panel = document.querySelector("fit-properties")
      return header?.shadowRoot?.innerHTML && palette?.shadowRoot?.innerHTML && panel?.shadowRoot?.innerHTML
    })
  })

  test("ヘッダーが画面上部に表示される(幅:全幅, 高さ:48px)", async ({ page }) => {
    const header = page.locator("fit-header")
    const box = await header.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBe(0)
    expect(box!.height).toBe(48)
    const viewport = page.viewportSize()!
    expect(box!.width).toBe(viewport.width)
  })

  test("パレットがヘッダーの下、左端に表示される(幅:180px)", async ({ page }) => {
    const palette = page.locator("fit-palette")
    const box = await palette.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBe(0)
    expect(box!.y).toBe(48)
    expect(box!.width).toBe(180)
  })

  test("キャンバスエリアが残りの領域を埋めている", async ({ page }) => {
    const canvasArea = page.locator(".canvas-area")
    const box = await canvasArea.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBe(180)
    expect(box!.y).toBe(48)
    const viewport = page.viewportSize()!
    expect(box!.width).toBe(viewport.width - 180)
    expect(box!.height).toBe(viewport.height - 48)
  })

  test("右パネルがキャンバス右側に表示される", async ({ page }) => {
    const panel = page.locator("fit-properties")
    const box = await panel.boundingBox()
    expect(box).not.toBeNull()
    const viewport = page.viewportSize()!
    expect(box!.x + box!.width).toBeGreaterThan(viewport.width - 30)
  })

  test("パレットのアイテムクリックでウィジェットが追加される", async ({ page }) => {
    const palette = page.locator("fit-palette")
    const firstItem = palette.locator(".palette-item").first()
    await firstItem.click()
    await page.waitForTimeout(200)
    const canvas = page.locator("fit-canvas")
    const widgetWrappers = canvas.locator("[data-widget-id]")
    await expect(widgetWrappers).toHaveCount(1)
  })

  test("右パネルのトグルで開閉する", async ({ page }) => {
    const panel = page.locator("fit-properties")
    const initialBox = await panel.boundingBox()
    expect(initialBox!.width).toBeGreaterThan(200)
    const toggleBtn = panel.locator(".toggle-btn")
    await toggleBtn.click()
    await page.waitForTimeout(300)
    const collapsedBox = await panel.boundingBox()
    expect(collapsedBox!.width).toBeLessThan(100)
  })
})
