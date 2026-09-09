import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element is on — or near — the screen.
 *
 * Used to stop decorative loops that would otherwise run for the whole visit.
 * A CSS animation with `infinite` never stops on its own: the compositor keeps
 * producing frames for it whether or not anyone can see it, which on a phone
 * is heat and battery spent on nothing. The landing page is 29,000px tall, so
 * almost all of that motion is off-screen almost all of the time.
 *
 * Seeded `true`, and left that way if the browser has no IntersectionObserver.
 * The failure that matters here is a ribbon or a ring frozen mid-flight, which
 * reads as a broken page; a loop that runs when it did not need to costs
 * nothing but power. So every path that is not a definite "off-screen" leaves
 * the motion running.
 *
 * `rootMargin` grows the box so a section starts moving slightly before it is
 * reached, and does not stop the instant its edge leaves.
 */
export function useInView({ rootMargin = '200px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
