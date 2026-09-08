import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nylonium-theme'

/**
 * Light/dark toggle backed by localStorage, falling back to the OS setting.
 * The initial class is applied by the inline script in index.html to avoid a
 * flash of the wrong theme, so this hook only mirrors and updates that state.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
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
