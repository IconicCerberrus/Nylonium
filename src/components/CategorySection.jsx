import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import VariantCard from './ui/VariantCard'
import Reveal from './ui/Reveal'
import { useMediaQuery } from './ui/useMediaQuery'

/**
 * One category of a product family: heading, note, then its variants.
 *
 * Above the large breakpoint the variants sit in a plain three-column grid,
 * because the whole set fits on screen and paging through it would be
 * busywork. Below that they become a snapping rail — one card at a time on a
 * phone, three across on a tablet — advanced by swipe or by the two arrows.
 *
 * The arrows live in the heading row rather than floating over the track, so
 * they can never sit on top of a card or clip one at the edge.
 */
export default function CategorySection({ category, index = 0 }) {
  const railRef = useRef(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /**
   * Moves exactly one card.
   *
   * Works from the card index rather than a pixel delta: a delta gets pulled
   * off by scroll-snap and drifts a little further out of step with every
   * press, whereas snapping to `index x stride` always lands dead on a card.
   */
  const step = useCallback((direction) => {
    const rail = railRef.current
    const first = rail?.firstElementChild
    if (!rail || !first) return

    const style = getComputedStyle(rail)
    const gap = parseFloat(style.columnGap) || 0
    const stride = first.getBoundingClientRect().width + gap
    if (!stride) return

    const count = rail.children.length
    const perView = Math.max(1, Math.round(rail.clientWidth / stride))
    const lastIndex = Math.max(0, count - perView)

    const current = Math.round(Math.abs(rail.scrollLeft) / stride)
    const next = Math.min(Math.max(current + direction, 0), lastIndex)

    // Right-to-left scrollers count away from zero in the negative direction.
    const sign = style.direction === 'rtl' ? -1 : 1
    rail.scrollTo({ left: sign * next * stride, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail || isDesktop) return

    let frame = 0
    const update = () => {
      frame = 0
      // In RTL scrollLeft counts down from 0, so compare on magnitude.
      const pos = Math.abs(rail.scrollLeft)
      const max = rail.scrollWidth - rail.clientWidth
      setAtStart(pos <= 2)
      setAtEnd(pos >= max - 2)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    rail.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isDesktop])

  const arrow =
    'ease-soft grid size-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] transition-[color,border-color,opacity,transform] duration-400 hover:border-brand-400/70 hover:text-brand-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30'

  return (
    <Reveal as="section" id={category.id} className="scroll-mt-28">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold sm:text-2xl">{category.title}</h2>
          {category.note && (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-body)]">
              {category.note}
            </p>
          )}
        </div>

        {!isDesktop && (
          <div className="flex shrink-0 items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="قبلی"
              className={arrow}
            >
              <ChevronRight className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="بعدی"
              className={arrow}
            >
              <ChevronLeft className="size-4.5" />
            </button>
          </div>
        )}
      </header>

      {isDesktop ? (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {category.items.map((item) => (
            <VariantCard key={item.id} item={item} glyph={category.glyph} />
          ))}
        </div>
      ) : (
        // Kept inside the page gutter rather than bled to the screen edges:
        // a padded scroller makes scroll-snap align to the border edge, which
        // throws every step off by the padding.
        <div ref={railRef} className="rail mt-6 [--rail-visible:1] sm:[--rail-visible:3]">
          {category.items.map((item) => (
            <VariantCard key={item.id} item={item} glyph={category.glyph} />
          ))}
        </div>
      )}

      {index >= 0 && (
        <p className="sr-only">
          {category.items.length} محصول در دسته {category.title}
        </p>
      )}
    </Reveal>
  )
}
