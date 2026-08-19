import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ui/ProductCard'
import Reveal from './ui/Reveal'

/**
 * One swipeable row of products for phone screens.
 *
 * Paging is native CSS scroll-snap, so a finger drag behaves exactly the way
 * the platform expects and the arrows simply nudge the same scroller by one
 * card. `scrollBy` is used rather than `scrollLeft` maths because its offsets
 * are physical pixels and therefore identical under RTL and LTR.
 */
export default function ProductRail({ title, items, anchorOwner = false }) {
  const railRef = useRef(null)
  const [index, setIndex] = useState(0)

  const step = useCallback((direction) => {
    const rail = railRef.current
    if (!rail) return
    // direction -1 walks toward the next card (leftwards in an RTL row).
    rail.scrollBy({ left: direction * rail.clientWidth, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let frame = 0
    const update = () => {
      frame = 0
      const width = rail.clientWidth || 1
      setIndex(Math.round(Math.abs(rail.scrollLeft) / width))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  if (items.length === 0) return null

  const atFirst = index <= 0
  const atLast = index >= items.length - 1

  const arrowClass =
    'ease-soft grid size-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]/85 text-[var(--text-body)] shadow-lg backdrop-blur-sm transition-[opacity,color,border-color] duration-400 active:scale-90 disabled:pointer-events-none disabled:opacity-30'

  return (
    <Reveal className="mt-14 first:mt-0">
      <h3 className="text-center text-base font-extrabold text-[var(--text-strong)]">{title}</h3>

      <div className="relative mt-4">
        <div ref={railRef} className="snap-rail -mx-4 px-4">
          {items.map((p) => (
            <div key={p.id} className="h-full px-1">
              <ProductCard product={p} anchored={anchorOwner} reveal={false} />
            </div>
          ))}
        </div>

        {/* Right arrow steps back, left arrow steps forward — matching the
            reading direction of the row. */}
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atFirst}
          aria-label="کارت قبلی"
          className={`${arrowClass} absolute top-28 right-0 z-10`}
        >
          <ChevronRight className="size-4.5" />
        </button>

        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atLast}
          aria-label="کارت بعدی"
          className={`${arrowClass} absolute top-28 left-0 z-10`}
        >
          <ChevronLeft className="size-4.5" />
        </button>
      </div>

      {/* Position dots */}
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {items.map((p, i) => (
          <span
            key={p.id}
            className={`ease-soft h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-5 bg-brand-500' : 'w-1.5 bg-[var(--line)]'
            }`}
          />
        ))}
      </div>
    </Reveal>
  )
}
