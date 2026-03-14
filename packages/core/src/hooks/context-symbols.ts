export const CONTEXT_EVENT = "blask.context"

export type ContextRequestDetail<T, C = unknown> = {
  context: C
  callback: (value: T) => void
  value?: T
  unsubscribe?: () => void
}
