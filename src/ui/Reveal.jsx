import { useEffect, useRef, useState } from 'react'

const SUPPORTS_IO = typeof IntersectionObserver !== 'undefined'

/**
 * Fades + lifts its children into place the first time they approach the
 * viewport.
 *
 * Two things keep the page from looking like it assembles itself under the
 * scroll. Anything already on — or just below — the first screen is shown
 * synchronously at mount, so the opening view is simply *there* with no
 * observer round-trip. Everything further down uses an observer whose root is
 * grown 45% past the bottom of the screen, so a block has finished revealing
 * before the reader reaches it.
 *
 * Only `opacity` and `translate` animate, which keeps the work on the
 * compositor thread. Readers who ask for reduced motion, and browsers without
 * IntersectionObserver, get the final state immediately.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 18,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!SUPPORTS_IO || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    // Already within reach of the opening screen — no need to wait.
    if (el.getBoundingClientRect().top < window.innerHeight * 1.15) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { rootMargin: '200px 0px 45% 0px', threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`ease-soft transition-[opacity,translate] duration-[900ms] motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        translate: shown ? undefined : `0 ${y}px`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
