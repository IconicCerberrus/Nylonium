import { useEffect, useState } from 'react'
import { isBrowser } from '../lib/browser.js'

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
  // Node has no viewport, so the build-time pass answers `false` for every
  // query and the static markup is always the narrow layout. In the browser
  // the seed is still read synchronously, which is the whole point of the
  // hook — so on a wide screen the first client render disagrees with the
  // markup it is hydrating and React re-renders that subtree once. That is
  // the correct trade here: a single reconciliation on load, rather than a
  // layout that visibly swaps after paint on every device.
  const [matches, setMatches] = useState(() => isBrowser && window.matchMedia(query).matches)

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
