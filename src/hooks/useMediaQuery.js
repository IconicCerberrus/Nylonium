import { useEffect, useState } from 'react'

/**
 * Tracks a media query.
 *
 * Answers `false` until the component has mounted, on the server and in the
 * browser alike. The seed used to be read synchronously from `matchMedia`,
 * which is better on its own terms — but the markup is prerendered now, and a
 * first client render that disagreed with it would make React throw the
 * server's HTML away for that subtree and build it again. So the narrow
 * layout is what ships, and a wide screen corrects itself on mount.
 *
 * Listens to `resize` as well as the query's own `change` event. The change
 * event is the correct signal, but it does not always arrive when a viewport
 * is resized programmatically or restored from a background tab, and a missed
 * one strands the component on the wrong layout for the rest of the session.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

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
