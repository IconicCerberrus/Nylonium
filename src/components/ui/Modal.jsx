import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Entry and exit are deliberately different curves. Coming in uses an
 * expo-out: it arrives quickly then settles almost to a stop, which reads as
 * "floating up". Going out uses an ease-in so it creeps away before
 * accelerating, instead of snapping the moment the close button is pressed.
 */
const ENTER_MS = 480
const EXIT_MS = 400
const ENTER_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EXIT_EASE = 'cubic-bezier(0.5, 0, 0.75, 0.2)'

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
export default function Modal({ open, onClose, title, subtitle, icon, children, footer }) {
  const panelRef = useRef(null)
  const openerRef = useRef(null)
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)

  // Mount immediately on open; wait out the full exit transition before
  // unmounting, with headroom so a late frame can never clip the fade.
  useEffect(() => {
    if (open) {
      setMounted(true)
      // Two frames: the first commits the closed state, the second flips to
      // open — without it the browser coalesces both and skips the animation.
      let second = 0
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(first)
        cancelAnimationFrame(second)
      }
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), EXIT_MS + 60)
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
      className="fixed inset-0 z-90 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
      onKeyDown={onKeyDown}
    >
      <div
        className={`absolute inset-0 bg-ink-950/60 backdrop-blur-sm transition-opacity motion-reduce:transition-none ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDuration: `${shown ? ENTER_MS : EXIT_MS}ms`,
          transitionTimingFunction: shown ? ENTER_EASE : EXIT_EASE,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-4xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl shadow-ink-950/25 outline-none transition-[opacity,transform] will-change-[opacity,transform] motion-reduce:transition-none sm:max-w-3xl sm:rounded-4xl dark:shadow-black/60"
        style={{
          transitionDuration: `${shown ? ENTER_MS : EXIT_MS}ms`,
          transitionTimingFunction: shown ? ENTER_EASE : EXIT_EASE,
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0) scale(1)' : 'translateY(2.25rem) scale(0.96)',
        }}
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
