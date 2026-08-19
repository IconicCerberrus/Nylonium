import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/site'

const fa = new Intl.NumberFormat('fa-IR')

/**
 * Counts up from zero every time the figure scrolls into view.
 *
 * The observer is kept alive rather than disconnected on first hit: leaving
 * the section resets the number to zero and re-entering replays the count, so
 * the band animates again on each visit.
 */
function CountUp({ value, suffix }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value)
      return
    }

    let raf = 0
    const duration = 1600

    const run = () => {
      cancelAnimationFrame(raf)
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        // easeOutExpo — quick out of the gate, long gentle settle.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        setN(Math.round(value * eased))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
        } else {
          cancelAnimationFrame(raf)
          setN(0)
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {fa.format(n)}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="relative border-b border-[var(--line)] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="relative text-center lg:text-right">
              <dt className="text-gradient text-3xl font-black sm:text-4xl lg:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dt>
              <dd className="mt-2 text-sm text-[var(--text-soft)] sm:text-base">{s.label}</dd>
              {/* Hairline separator sitting in the gap before each column. */}
              {i > 0 && (
                <span
                  className="absolute inset-y-1 right-[-0.75rem] hidden w-px bg-[var(--line)] lg:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
