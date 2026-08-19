import { useEffect, useState } from 'react'
import Logo from './ui/Logo'
import { site } from '../data/site'

/**
 * Holds a calm brand screen over the page until the webfont has arrived and
 * the browser has painted a frame, then dissolves.
 *
 * Without this the first paint lands in a fallback font and re-flows the
 * moment Vazirmatn resolves, which is most of what read as "the site loads in
 * pieces". The overlay is capped by a timeout so a slow font can never hold
 * the page hostage, and it is skipped entirely for reduced-motion readers.
 */
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
    // Never let a stalled font request keep the curtain up.
    const cap = new Promise((resolve) => setTimeout(resolve, 2200))

    // A short timer rather than rAF: requestAnimationFrame never fires while
    // the tab is backgrounded, which would strand the curtain on screen.
    Promise.race([fonts, cap]).then(() => setTimeout(finish, 120))

    return () => {
      cancelled = true
    }
  }, [])

  // Unmount only after the fade-out has finished playing.
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), 700)
    return () => clearTimeout(t)
  }, [done])

  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [gone])

  if (gone) return null

  return (
    <div
      className={`ease-soft fixed inset-0 z-100 grid place-items-center bg-[var(--surface)] transition-opacity duration-700 ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
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
