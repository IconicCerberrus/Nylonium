import { useEffect, useState } from 'react'
import Logo from '../ui/Logo'
import { site } from '../data/site.js'

/**
 * Holds a calm brand screen over the page until the webfont has arrived and
 * the browser has painted a frame, then dissolves.
 *
 * Without this the first paint lands in a fallback font and re-flows the
 * moment Vazirmatn resolves, which is most of what read as "the site loads in
 * pieces". The overlay is capped by a timeout so a slow font can never hold
 * the page hostage, and it is skipped entirely for reduced-motion readers.
 *
 * Every duration here is a cost paid on top of a page that is already ready,
 * so they are kept as short as the job allows. The font is bundled and
 * preloaded, so it is resolved long before the cap; the cap exists only for
 * the pathological case, and holding the page for most of a second to insure
 * against it made the common visit worse than the problem being solved.
 */
/** Ceiling on waiting for the webfont before the curtain lifts regardless. */
const FONT_WAIT_CAP = 300
/** Long enough for the resolved font to be painted, short enough not to read as a pause. */
const SETTLE = 40
/** Fade-out, and therefore how long the curtain stays on top of a live page. */
const FADE = 250
export default function PageLoader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const finish = () => {
      if (!cancelled) setDone(true)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    const fonts = document.fonts?.ready ?? Promise.resolve()
    // Never let a stalled font request keep the curtain up. The font is
    // bundled locally and preloaded, so it resolves well inside this — the
    // cap only exists for the pathological case.
    const cap = new Promise((resolve) => setTimeout(resolve, FONT_WAIT_CAP))

    // A short timer rather than rAF: requestAnimationFrame never fires while
    // the tab is backgrounded, which would strand the curtain on screen.
    Promise.race([fonts, cap]).then(() => setTimeout(finish, SETTLE))

    return () => {
      cancelled = true
    }
  }, [])

  // Unmount only after the fade-out has finished playing.
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), FADE)
    return () => clearTimeout(t)
  }, [done])

  // Released as the fade begins rather than when it ends. The curtain is
  // already `pointer-events-none` by then and the page underneath is live, so
  // holding the scroll for the length of the fade only makes the page feel
  // stuck at the moment it is becoming usable.
  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  if (gone) return null

  return (
    <div
      className={`ease-soft fixed inset-0 z-100 grid place-items-center bg-[var(--surface)] transition-opacity ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE}ms` }}
      role="status"
      aria-live="polite"
    >
      <div className="mesh-halo absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-5">
        <Logo id="loader" className="size-16 animate-[float_3s_ease-in-out_infinite]" />

        <span className="text-sm font-extrabold text-[var(--text-strong)]">{site.name}</span>

        <span
          className="h-0.5 w-28 overflow-hidden rounded-full bg-[var(--line)]"
          aria-hidden="true"
        >
          <span className="animate-sweep block h-full w-1/2 rounded-full bg-linear-to-l from-brand-500 to-accent-400" />
        </span>

        <span className="sr-only">در حال بارگذاری…</span>
      </div>
    </div>
  )
}
