import type { InteractionMode } from "../types"

export type ModeStoreListener = () => void

export class ModeStore {
  private mode: InteractionMode = "edit"
  private listeners: Set<ModeStoreListener> = new Set()

  getMode(): InteractionMode { return this.mode }

  setMode(mode: InteractionMode): void {
    if (this.mode === mode) return
    this.mode = mode
    this.notify()
  }

  toggle(): void {
    this.setMode(this.mode === "edit" ? "preview" : "edit")
  }

  subscribe(listener: ModeStoreListener): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void { for (const l of this.listeners) l() }
}
