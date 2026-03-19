import type { WidgetKind } from "../types"

export interface WidgetCatalogEntry {
  kind: WidgetKind
  label: string
  defaultWidth: number
  defaultHeight: number
  defaultProps: Record<string, string | boolean | number>
  defaultContent: string
}

const CATALOG: WidgetCatalogEntry[] = [
  { kind: "ui-button",       label: "Button",       defaultWidth: 120, defaultHeight: 40,  defaultProps: { variant: "solid", color: "primary" }, defaultContent: "Button" },
  { kind: "ui-input",        label: "Input",        defaultWidth: 200, defaultHeight: 40,  defaultProps: { placeholder: "Type here..." },        defaultContent: "" },
  { kind: "ui-card",         label: "Card",         defaultWidth: 240, defaultHeight: 160, defaultProps: {},                                     defaultContent: "Card content" },
  { kind: "ui-badge",        label: "Badge",        defaultWidth: 80,  defaultHeight: 40,  defaultProps: { color: "primary" },                   defaultContent: "Badge" },
  { kind: "ui-switch",       label: "Switch",       defaultWidth: 60,  defaultHeight: 40,  defaultProps: {},                                     defaultContent: "" },
  { kind: "ui-checkbox",     label: "Checkbox",     defaultWidth: 120, defaultHeight: 40,  defaultProps: {},                                     defaultContent: "Check" },
  { kind: "ui-chip",         label: "Chip",         defaultWidth: 80,  defaultHeight: 40,  defaultProps: {},                                     defaultContent: "Chip" },
  { kind: "ui-avatar",       label: "Avatar",       defaultWidth: 60,  defaultHeight: 60,  defaultProps: { name: "User" },                       defaultContent: "" },
  { kind: "ui-progress-bar", label: "Progress Bar", defaultWidth: 200, defaultHeight: 20,  defaultProps: { value: 60 },                          defaultContent: "" },
  { kind: "ui-textarea",     label: "Textarea",     defaultWidth: 200, defaultHeight: 100, defaultProps: { placeholder: "Enter text..." },       defaultContent: "" },
]

export function getRegistry(): WidgetCatalogEntry[] {
  return CATALOG
}

export function getEntry(kind: WidgetKind): WidgetCatalogEntry | undefined {
  return CATALOG.find(e => e.kind === kind)
}
