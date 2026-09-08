import { useEffect, useState } from 'react'

/**
 * Tracks a media query. Seeded synchronously so the very first render already
 * matches the device — the mobile rails and the desktop grid never swap after
 * paint.
 *
 * Listens to `resize` as well as the query's own `change` event. The change
 * event is the correct signal, but it does not always arrive when a viewport
 * is resized programmatically or restored from a background tab, and a missed
 * one strands the component on the wrong layout for the rest of the session.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setMatches(mq.matches)

    sync()
    mq.addEventListener('change', sync)
    window.addEventListener('resize', sync, { passive: true })
    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [query])

  return matches
}
