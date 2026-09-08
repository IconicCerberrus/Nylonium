import { useRef } from 'react'

/**
 * Holds on to the last non-empty value.
 *
 * Dialogs are driven by "which item is selected", so clearing the selection to
 * close one also wipes its content — and the panel spends its whole exit
 * animation rendering an empty shell. Feeding the content through this keeps
 * the outgoing item on screen until the dialog has finished leaving.
 */
export function useRetained(value) {
  const last = useRef(value)
  if (value != null) last.current = value
  return value ?? last.current
}
