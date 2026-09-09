import { products } from '../data/site.js'
import { useInView } from '../hooks/useInView.js'

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
  // The ribbon used to be gated by a passive scroll listener that detached
  // itself the first time the band was reached — a one-way latch, so from
  // then on the strip slid for the rest of the visit whether or not it was
  // on screen. `useInView` replaces both halves: it starts the ribbon on
  // approach and stops it again once the band is behind the reader, and it
  // fails open, which was the reason the observer was avoided here. A frozen
  // ribbon still looks broken; this one only ever freezes out of sight.
  const [bandRef, inView] = useInView()

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
        style={{ animationPlayState: inView ? 'running' : 'paused' }}
      >
        {Array.from({ length: COPIES }, (_, i) => (
          <Row key={i} hidden={i > 0} />
        ))}
      </div>
    </div>
  )
}
