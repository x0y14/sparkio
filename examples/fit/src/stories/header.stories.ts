import type { Meta, StoryObj } from "@storybook/html"

const meta: Meta = { title: "Fit/Header" }
export default meta
type Story = StoryObj

export const EditMode: Story = {
  render: () => {
    const container = document.createElement("div")
    container.style.width = "800px"
    const header = document.createElement("fit-header")
    container.appendChild(header)
    return container
  },
}

export const PreviewMode: Story = {
  render: () => {
    const container = document.createElement("div")
    container.style.width = "800px"
    const header = document.createElement("fit-header")
    container.appendChild(header)
    setTimeout(() => {
      const btn = header.shadowRoot?.querySelector('button[data-mode="preview"]') as HTMLElement
      btn?.click()
    }, 100)
    return container
  },
}
