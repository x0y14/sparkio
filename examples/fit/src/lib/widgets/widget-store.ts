import type { Widget, WidgetId } from "../types"

export type WidgetStoreListener = () => void

export class WidgetStore {
  private widgets: Widget[] = []
  private selectedId: WidgetId | null = null
  private listeners: Set<WidgetStoreListener> = new Set()

  getAll(): Widget[] { return this.widgets }
  get(id: WidgetId): Widget | undefined { return this.widgets.find(w => w.id === id) }
  getSelected(): Widget | null {
    if (this.selectedId === null) return null
    return this.get(this.selectedId) ?? null
  }
  getSelectedId(): WidgetId | null { return this.selectedId }

  add(widget: Widget): void { this.widgets.push(widget); this.notify() }

  update(id: WidgetId, patch: Partial<Omit<Widget, "id" | "kind">>): void {
    const w = this.get(id)
    if (!w) return
    Object.assign(w, patch)
    this.notify()
  }

  remove(id: WidgetId): void {
    this.widgets = this.widgets.filter(w => w.id !== id)
    if (this.selectedId === id) this.selectedId = null
    this.notify()
  }

  select(id: WidgetId | null): void {
    this.selectedId = id
    if (id !== null) {
      const idx = this.widgets.findIndex(w => w.id === id)
      if (idx >= 0 && idx < this.widgets.length - 1) {
        const [w] = this.widgets.splice(idx, 1)
        this.widgets.push(w)
      }
    }
    this.notify()
  }

  subscribe(listener: WidgetStoreListener): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void { for (const l of this.listeners) l() }
}
