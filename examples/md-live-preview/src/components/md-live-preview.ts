import { defineElement, css, useEffect, useHost } from "@sparkio/core"
import { renderWithLocations, applyHighlight } from "../utils/markdoc-highlight"
import "./md-editor"
import "./md-preview"

const MdLivePreview = defineElement(
  {
    tag: "md-live-preview",
    styles: css`@unocss-placeholder
:host { @apply block h-screen; }`,
  },
  () => {
    const host = useHost()

    useEffect(() => {
      const root = host.current.shadowRoot!
      const editor = root.querySelector("md-editor")
      if (!editor) return

      let currentOffset = 0

      const inputHandler = ((e: Event) => {
        if (!(e instanceof CustomEvent)) return
        const source = e.detail?.value ?? ""
        const html = renderWithLocations(source)
        const preview = root.querySelector("md-preview") as any
        if (preview) {
          preview.content = html
          setTimeout(() => applyHighlight(preview, currentOffset), 0)
        }
      }) as EventListener

      const cursorHandler = ((e: Event) => {
        if (!(e instanceof CustomEvent)) return
        currentOffset = e.detail?.offset ?? 0
        const preview = root.querySelector("md-preview") as HTMLElement
        if (preview) applyHighlight(preview, currentOffset)
      }) as EventListener

      editor.addEventListener("input", inputHandler)
      editor.addEventListener("cursor-move", cursorHandler)
      return () => {
        editor.removeEventListener("input", inputHandler)
        editor.removeEventListener("cursor-move", cursorHandler)
      }
    }, [])

    return `<div class="flex flex-col h-full">
  <header class="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
    <h1 class="text-lg font-semibold text-gray-800">Markdoc Live Preview</h1>
  </header>
  <div class="flex flex-1 min-h-0">
    <div class="w-1/2 border-r border-gray-200">
      <md-editor></md-editor>
    </div>
    <div class="w-1/2 overflow-auto">
      <md-preview></md-preview>
    </div>
  </div>
</div>`
  },
)

export default MdLivePreview
