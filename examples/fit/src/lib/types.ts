export type WidgetId = string

export type HandleSide = "top" | "right" | "bottom" | "left"

export type WidgetKind =
  | "ui-button"
  | "ui-input"
  | "ui-card"
  | "ui-badge"
  | "ui-switch"
  | "ui-checkbox"
  | "ui-chip"
  | "ui-avatar"
  | "ui-progress-bar"
  | "ui-textarea"

export interface Widget {
  id: WidgetId
  kind: WidgetKind
  x: number
  y: number
  width: number
  height: number
  props: Record<string, string | boolean | number>
  content: string
}

export type HitTarget =
  | { kind: "widget"; widgetId: WidgetId }
  | { kind: "handle"; widgetId: WidgetId; side: HandleSide }
  | { kind: "canvas" }

export type InteractionMode = "edit" | "preview"
