import type { Widget, WidgetKind, InteractionMode } from "../types"
import { WidgetStore } from "../widgets/widget-store"
import { getEntry } from "../widgets/widget-registry"
import { snap } from "../interaction/snap"
import { hitTest } from "../interaction/hit-test"
import { beginDrag, moveDrag, type DragState } from "../interaction/drag-handler"
import { beginResize, moveResize, type ResizeState } from "../interaction/resize-handler"
import { createClipboard, copyWidget, pasteWidget } from "../interaction/clipboard"
import { resolveKeyAction } from "../interaction/keyboard-handler"

let nextId = 1
function generateId(): string { return `w_${nextId++}` }

export class Scene {
  private container: HTMLElement
  private store: WidgetStore
  private clipboard = createClipboard()
  private dragState: DragState | null = null
  private resizeState: ResizeState | null = null
  private mode: InteractionMode = "edit"
  private elements: Map<string, HTMLElement> = new Map()
  private unsub: () => void

  private onMouseDown = (e: MouseEvent) => this.handleMouseDown(e)
  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e)
  private onMouseUp = () => this.handleMouseUp()
  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e)
  private onAddWidget = (e: Event) => {
    const kind = (e as CustomEvent).detail?.kind as WidgetKind
    if (kind) this.addWidget(kind)
  }
  private onModeChange = (e: Event) => {
    const mode = (e as CustomEvent).detail?.mode as InteractionMode
    if (mode && (mode === "edit" || mode === "preview")) {
      this.mode = mode
      this.syncPointerEvents()
      this.sync()
    }
  }

  constructor(container: HTMLElement, store: WidgetStore) {
    this.container = container
    this.store = store

    container.addEventListener("mousedown", this.onMouseDown)
    container.addEventListener("mousemove", this.onMouseMove)
    container.addEventListener("mouseup", this.onMouseUp)
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("fit:add-widget", this.onAddWidget)
    window.addEventListener("fit:mode-change", this.onModeChange)

    this.unsub = store.subscribe(() => this.sync())
  }

  getMode(): InteractionMode { return this.mode }

  addWidget(kind: WidgetKind): void {
    const entry = getEntry(kind)
    if (!entry) return
    const id = generateId()
    const x = snap(100 + Math.random() * 400)
    const y = snap(100 + Math.random() * 300)
    const widget: Widget = {
      id, kind, x, y,
      width: entry.defaultWidth, height: entry.defaultHeight,
      props: { ...entry.defaultProps }, content: entry.defaultContent,
    }
    this.store.add(widget)
    this.store.select(id)
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.mode === "preview") return
    const rect = this.container.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const target = hitTest(this.store.getAll(), this.store.getSelectedId(), px, py)

    if (target.kind === "handle") {
      const w = this.store.get(target.widgetId)
      if (w) this.resizeState = beginResize(w, target.side, px, py)
    } else if (target.kind === "widget") {
      this.store.select(target.widgetId)
      const w = this.store.get(target.widgetId)
      if (w) this.dragState = beginDrag(w, px, py)
    } else {
      this.store.select(null)
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.container.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    if (this.resizeState) {
      const result = moveResize(this.resizeState, px, py)
      this.store.update(this.resizeState.widgetId, result)
    } else if (this.dragState) {
      const pos = moveDrag(this.dragState, px, py)
      this.store.update(this.dragState.widgetId, pos)
    }
  }

  private handleMouseUp(): void {
    this.dragState = null
    this.resizeState = null
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.mode === "preview") return
    const action = resolveKeyAction(e)
    switch (action.kind) {
      case "delete": {
        const id = this.store.getSelectedId()
        if (id) this.store.remove(id)
        break
      }
      case "copy": {
        const w = this.store.getSelected()
        if (w) copyWidget(this.clipboard, w)
        break
      }
      case "paste": {
        const data = pasteWidget(this.clipboard, snap(200), snap(200))
        if (data) {
          const id = generateId()
          this.store.add({ ...data, id })
          this.store.select(id)
        }
        break
      }
    }
  }

  private sync(): void {
    const widgets = this.store.getAll()
    const selectedId = this.store.getSelectedId()
    const currentIds = new Set(widgets.map(w => w.id))

    // 削除されたウィジェットのDOM除去
    for (const [id, el] of this.elements) {
      if (!currentIds.has(id)) {
        el.remove()
        this.elements.delete(id)
      }
    }

    // ウィジェットごとにDOM同期
    for (let i = 0; i < widgets.length; i++) {
      const w = widgets[i]
      let wrapper = this.elements.get(w.id)

      if (!wrapper) {
        wrapper = this.createWidgetElement(w)
        this.container.appendChild(wrapper)
        this.elements.set(w.id, wrapper)
      }

      wrapper.style.left = `${w.x}px`
      wrapper.style.top = `${w.y}px`
      wrapper.style.width = `${w.width}px`
      wrapper.style.height = `${w.height}px`
      wrapper.style.zIndex = `${i}`
    }

    // 選択オーバーレイ
    const existingOverlay = this.container.querySelector(".selection-overlay")
    if (existingOverlay) existingOverlay.remove()

    if (selectedId !== null && this.mode === "edit") {
      const selected = this.store.get(selectedId)
      if (selected) {
        const overlay = this.createSelectionOverlay(selected)
        this.container.appendChild(overlay)
      }
    }
  }

  private syncPointerEvents(): void {
    const pe = this.mode === "preview" ? "auto" : "none"
    for (const wrapper of this.elements.values()) {
      const component = wrapper.firstElementChild as HTMLElement | null
      if (component) component.style.pointerEvents = pe
    }
  }

  private createWidgetElement(widget: Widget): HTMLElement {
    const wrapper = document.createElement("div")
    wrapper.dataset.widgetId = widget.id
    wrapper.style.position = "absolute"
    wrapper.style.boxSizing = "border-box"

    const component = document.createElement(widget.kind)
    for (const [key, val] of Object.entries(widget.props)) {
      component.setAttribute(key, String(val))
    }
    component.textContent = widget.content
    component.style.width = "100%"
    component.style.height = "100%"
    component.style.pointerEvents = this.mode === "preview" ? "auto" : "none"

    wrapper.appendChild(component)
    return wrapper
  }

  private createSelectionOverlay(widget: Widget): HTMLElement {
    const overlay = document.createElement("div")
    overlay.className = "selection-overlay"
    overlay.style.position = "absolute"
    overlay.style.left = `${widget.x}px`
    overlay.style.top = `${widget.y}px`
    overlay.style.width = `${widget.width}px`
    overlay.style.height = `${widget.height}px`
    overlay.style.border = "2px solid #8b8bff"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "9999"
    overlay.style.boxSizing = "border-box"

    const handlePositions: Array<{ side: string; left: string; top: string; cursor: string }> = [
      { side: "top",    left: "50%", top: "0",    cursor: "ns-resize" },
      { side: "right",  left: "100%", top: "50%", cursor: "ew-resize" },
      { side: "bottom", left: "50%", top: "100%", cursor: "ns-resize" },
      { side: "left",   left: "0",   top: "50%",  cursor: "ew-resize" },
    ]

    for (const hp of handlePositions) {
      const handle = document.createElement("div")
      handle.className = "selection-handle"
      handle.dataset.side = hp.side
      handle.style.position = "absolute"
      handle.style.left = hp.left
      handle.style.top = hp.top
      handle.style.width = "8px"
      handle.style.height = "8px"
      handle.style.background = "#8b8bff"
      handle.style.transform = "translate(-50%, -50%)"
      handle.style.cursor = hp.cursor
      handle.style.pointerEvents = "auto"
      overlay.appendChild(handle)
    }

    return overlay
  }

  destroy(): void {
    this.unsub()
    this.container.removeEventListener("mousedown", this.onMouseDown)
    this.container.removeEventListener("mousemove", this.onMouseMove)
    this.container.removeEventListener("mouseup", this.onMouseUp)
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("fit:add-widget", this.onAddWidget)
    window.removeEventListener("fit:mode-change", this.onModeChange)
    for (const el of this.elements.values()) el.remove()
    this.elements.clear()
    const overlay = this.container.querySelector(".selection-overlay")
    if (overlay) overlay.remove()
  }
}
