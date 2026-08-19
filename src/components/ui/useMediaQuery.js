import { useEffect, useState } from 'react'

/**
 * Tracks a media query. Seeded synchronously so the very first render already
 * matches the device — the mobile rails and the desktop grid never swap after
 * paint.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
