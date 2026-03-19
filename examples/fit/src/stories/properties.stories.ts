import type { Meta, StoryObj } from "@storybook/html"

const meta: Meta = { title: "Fit/Properties" }
export default meta
type Story = StoryObj

export const Expanded: Story = {
  render: () => {
    const container = document.createElement("div")
    container.style.width = "300px"
    container.style.height = "400px"
    container.style.position = "relative"
    const panel = document.createElement("fit-properties")
    container.appendChild(panel)
    return container
  },
}
