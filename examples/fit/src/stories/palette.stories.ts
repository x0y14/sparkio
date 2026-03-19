import type { Meta, StoryObj } from "@storybook/html"

const meta: Meta = { title: "Fit/Palette" }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const container = document.createElement("div")
    container.style.width = "180px"
    container.style.height = "500px"
    const palette = document.createElement("fit-palette")
    ;(palette as HTMLElement).style.cssText = "height:100%"
    container.appendChild(palette)
    return container
  },
}
