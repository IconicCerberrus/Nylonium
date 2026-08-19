import { useEffect, useRef, useState } from 'react'
import { products } from '../data/site'

/** Copies of the list laid end to end. Three keeps the track far wider than
 *  any viewport, so there is always more list queued past the right edge. */
const COPIES = 3

/**
 * Endless keyword ribbon.
 *
 * The band is laid out `dir="ltr"` on purpose. Under the page's RTL direction
 * the band would pin the track's *right* edge to its own and let the overflow
 * hang off to the left — so sliding the track leftwards immediately opens a
 * blank on the right. In LTR the track's left edge is pinned instead and the
 * spare copies queue up off-screen to the right, which is exactly where they
 * need to be waiting. Each label carries `dir="rtl"` of its own so the Persian
 * text — and the parentheses inside it — still render correctly.
 *
 * The track then slides left by exactly one copy's width. At the end of that
 * shift copy #2 sits precisely where copy #1 started, so the frame is
 * identical and the animation restarts invisibly. A name leaving the left edge
 * is already queued again behind the last visible one: the strip is always
 * full, nothing blanks out, and the loop never ends.
 */
export default function Marquee() {
  const bandRef = useRef(null)
  const [entered, setEntered] = useState(false)

  // Start gate: a plain scroll check rather than an IntersectionObserver.
  // If an observer ever fails to deliver its first callback the ribbon would
  // sit frozen forever, and a frozen ribbon looks broken; a passive scroll
  // listener has no such failure mode and costs nothing, since it detaches
  // itself the moment the band is reached.
  useEffect(() => {
    const el = bandRef.current
    if (!el) return

    let frame = 0
    const check = () => {
      frame = 0
      const el = bandRef.current
      if (!el) return
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setEntered(true)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    check()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const items = products.map((p) => p.title)

  const Row = ({ hidden }) => (
    <ul
      className="flex shrink-0 items-center gap-10 px-5"
      aria-hidden={hidden ? 'true' : undefined}
    >
      {items.map((label, i) => (
        <li key={`${label}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span dir="rtl" className="text-sm font-semibold text-[var(--text-soft)] sm:text-base">
            {label}
          </span>
          <span className="size-1.5 rounded-full bg-brand-500/50" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      ref={bandRef}
      dir="ltr"
      className="relative flex overflow-hidden border-y border-[var(--line)] bg-[var(--surface-muted)] py-4"
      style={{
        maskImage: 'linear-gradient(to left, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="animate-marquee flex w-max motion-reduce:animate-none"
        style={{ animationPlayState: entered ? 'running' : 'paused' }}
      >
        {Array.from({ length: COPIES }, (_, i) => (
          <Row key={i} hidden={i > 0} />
        ))}
      </div>
    </div>
  )
}
