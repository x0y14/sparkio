import type { Meta, StoryObj } from "@storybook/html"

const meta: Meta = { title: "Fit/Canvas" }
export default meta
type Story = StoryObj

function createContainer(width = 600, height = 400): HTMLDivElement {
  const div = document.createElement("div")
  div.style.width = `${width}px`
  div.style.height = `${height}px`
  div.style.position = "relative"
  div.style.background = "#1a1a2e"
  return div
}

export const EmptyCanvas: Story = {
  render: () => {
    const container = createContainer()
    const canvas = document.createElement("fit-canvas")
    ;(canvas as HTMLElement).style.cssText = "position:absolute;inset:0"
    container.appendChild(canvas)
    return container
  },
}

export const WithWidgets: Story = {
  render: () => {
    const container = createContainer()
    const canvas = document.createElement("fit-canvas")
    ;(canvas as HTMLElement).style.cssText = "position:absolute;inset:0"
    container.appendChild(canvas)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("fit:add-widget", { detail: { kind: "ui-button" } }))
      window.dispatchEvent(new CustomEvent("fit:add-widget", { detail: { kind: "ui-card" } }))
      window.dispatchEvent(new CustomEvent("fit:add-widget", { detail: { kind: "ui-input" } }))
    }, 500)
    return container
  },
}
