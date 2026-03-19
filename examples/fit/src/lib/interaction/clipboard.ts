import type { Widget } from "../types"
import { snap } from "./snap"

export interface Clipboard {
  widget: Omit<Widget, "id" | "x" | "y"> | null
}

export function createClipboard(): Clipboard { return { widget: null } }

export function copyWidget(clipboard: Clipboard, widget: Widget): void {
  clipboard.widget = {
    kind: widget.kind, width: widget.width, height: widget.height,
    props: { ...widget.props }, content: widget.content,
  }
}

export function pasteWidget(clipboard: Clipboard, offsetX: number, offsetY: number): Omit<Widget, "id"> | null {
  if (!clipboard.widget) return null
  return {
    kind: clipboard.widget.kind,
    x: snap(offsetX), y: snap(offsetY),
    width: clipboard.widget.width, height: clipboard.widget.height,
    props: { ...clipboard.widget.props }, content: clipboard.widget.content,
  }
}
