import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Must stay in step with --dialog-exit in index.css. */
const EXIT_MS = 520

/**
 * Centred dialog used by every pop-up on the page.
 *
 * Behaviour is the part that is easy to get wrong, so it lives here once:
 * Escape and a backdrop click close it, the page behind is locked against
 * scrolling, focus moves in on open and returns to whatever opened it on
 * close, and Tab is trapped inside while it is up.
 *
 * It stays mounted through its own exit transition so closing animates rather
 * than snapping away.
 *
 * Rendered through a portal on `document.body`. `position: fixed` is measured
 * against the nearest ancestor that has a transform, and several callers sit
 * inside animated wrappers — without the portal the dialog would be trapped
 * inside a card instead of centred on the screen.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  layer = 90,
}) {
  const panelRef = useRef(null)
  const openerRef = useRef(null)
  const [mounted, setMounted] = useState(open)

  // Mount on open; hold the node through its exit transition before removing
  // it, with headroom so a late frame can never clip the fade. The entry
  // animation itself needs no JavaScript — @starting-style handles it.
  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    const t = setTimeout(() => setMounted(false), EXIT_MS + 80)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return

    openerRef.current = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    // Focus the panel itself rather than the close button, so a screen reader
    // announces the dialog's title before anything else.
    panel?.focus({ preventScroll: true })

    return () => {
      document.body.style.overflow = overflow
      openerRef.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const items = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!items?.length) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{ zIndex: layer }}
      role="presentation"
      onKeyDown={onKeyDown}
    >
      <div
        className="dialog-veil absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        data-closing={open ? undefined : ''}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="dialog-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-4xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl shadow-ink-950/25 outline-none sm:max-w-3xl sm:rounded-4xl dark:shadow-black/60"
        data-closing={open ? undefined : ''}
      >
        {/* Grab handle, phones only */}
        <span
          className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-[var(--line)] sm:hidden"
          aria-hidden="true"
        />

        <header className="relative flex shrink-0 items-start gap-4 border-b border-[var(--line)] p-5 sm:p-6">
          <div
            className="mesh-halo pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />

          {icon && (
            <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-bl from-brand-500/20 to-accent-500/12 text-brand-ink">
              {icon}
            </span>
          )}

          <div className="relative min-w-0 flex-1">
            <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-brand-ink">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="ease-soft relative grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--line)] text-[var(--text-body)] transition-[color,border-color,transform] duration-400 hover:border-brand-400/60 hover:text-brand-ink active:scale-90"
          >
            <X className="size-4.5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[var(--line)] p-5 sm:p-6">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
