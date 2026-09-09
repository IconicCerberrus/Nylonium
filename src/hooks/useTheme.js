import { useCallback, useEffect, useState } from 'react'
import { isBrowser } from '../lib/browser.js'

const STORAGE_KEY = 'nylonium-theme'

/**
 * Light/dark toggle backed by localStorage, falling back to the OS setting.
 * The initial class is applied by the inline script in index.html to avoid a
 * flash of the wrong theme, so this hook only mirrors and updates that state.
 */
export function useTheme() {
  // The build-time pass has no stored preference and no OS to ask, so it
  // renders the light-theme toggle. Nothing else depends on this: the themes
  // are CSS custom properties, so the same markup serves both and only the
  // toggle's own icon differs.
  const [theme, setTheme] = useState(() =>
    isBrowser && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Private mode / storage disabled — the in-memory theme still works.
    }
  }, [theme])

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      let stored = null
      try {
        stored = localStorage.getItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      if (!stored) setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return { theme, toggle }
}
