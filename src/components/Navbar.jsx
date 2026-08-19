import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, MoonStar, Phone, Send, Sun, X } from 'lucide-react'
import Logo from './ui/Logo'
import { useTheme } from './ui/useTheme'
import { contact, navLinks, site } from '../data/site'

/**
 * Reading-progress bar pinned under the header.
 *
 * Where scroll-driven animations are available the bar is driven entirely by
 * CSS (see `.scroll-progress` in index.css) and never touches JavaScript, so
 * it tracks the scroll perfectly smoothly. Elsewhere a rAF loop writes the
 * scale straight onto the node — no React state, so no re-render per frame,
 * which is what made the old version stutter.
 */
function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()')) return

    const bar = barRef.current
    if (!bar) return

    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? window.scrollY / max : 0
      bar.style.transform = `scaleX(${pct})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 h-0.5" aria-hidden="true">
      <div
        ref={barRef}
        className="scroll-progress h-full w-full bg-linear-to-l from-brand-500 to-accent-400"
      />
    </div>
  )
}

function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'روشن کردن تم' : 'تیره کردن تم'}
      title={isDark ? 'تم روشن' : 'تم تیره'}
      className={`ease-soft group relative grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)]/70 text-[var(--text-body)] transition-[border-color,color] duration-500 hover:border-brand-400/60 hover:text-brand-ink active:scale-95 ${className}`}
    >
      <Sun
        className={`absolute size-[1.15rem] transition-[opacity,rotate,scale] duration-300 ${
          isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <MoonStar
        className={`absolute size-[1.15rem] transition-[opacity,rotate,scale] duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}

/** Desktop nav item; renders a hover/focus dropdown when it has children. */
function DesktopLink({ link }) {
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  if (!link.children) {
    return (
      <a
        href={link.href}
        className="ease-soft relative rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-body)] transition-colors duration-400 hover:text-brand-ink after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-[420ms] after:ease-[cubic-bezier(0.33,1,0.45,1)] hover:after:origin-right hover:after:scale-x-100"
      >
        {link.label}
      </a>
    )
  }

  const show = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <a
        href={link.href}
        onFocus={show}
        aria-expanded={open}
        className="ease-soft flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-body)] transition-colors duration-400 hover:text-brand-ink"
      >
        {link.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </a>

      <div
        className={`absolute top-full right-0 w-60 pt-2 transition-[opacity,translate] duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <ul className="surface-glass overflow-hidden rounded-2xl p-1.5 shadow-xl shadow-ink-950/10 dark:shadow-black/40">
          {link.children.map((child) => (
            <li key={child.href}>
              <a
                href={child.href}
                onBlur={hide}
                className="ease-soft block rounded-xl px-3 py-2.5 text-sm text-[var(--text-body)] transition-colors duration-400 hover:bg-brand-500/10 hover:text-brand-ink"
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-100 focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        رفتن به محصولات
      </a>

      {/* Utility strip — hidden once the visitor starts scrolling. */}
      <div
        className={`hidden overflow-hidden border-b border-[var(--line)] bg-[var(--surface-muted)] transition-[height,opacity] duration-300 lg:block ${
          scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
        }`}
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 text-xs text-[var(--text-soft)]">
          <p>{site.tagline}</p>
          <div className="flex items-center gap-5">
            <span>{contact.hours}</span>
            <a
              href={contact.phoneHref}
              className="ease-soft flex items-center gap-1.5 font-medium text-[var(--text-body)] transition-colors duration-400 hover:text-brand-ink"
            >
              <Phone className="size-3.5" />
              <span dir="ltr">{contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'surface-glass border-x-0 border-t-0 shadow-lg shadow-ink-950/5 dark:shadow-black/30'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18">
          <a href="#top" className="group flex shrink-0 items-center gap-2.5">
            <Logo
              id="nav"
              className="ease-soft size-9 transition-transform duration-700 group-hover:rotate-6 lg:size-10"
            />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold text-[var(--text-strong)]">{site.name}</span>
              <span className="mt-0.5 text-[0.62rem] tracking-[0.22em] text-[var(--text-soft)] uppercase">
                {site.nameLatin}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <DesktopLink key={link.label} link={link} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="ease-soft hidden items-center gap-2 rounded-xl bg-linear-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-[box-shadow,transform] duration-500 hover:shadow-xl hover:shadow-brand-600/35 active:scale-95 sm:flex"
            >
              <Send className="size-4" />
              استعلام قیمت
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="باز کردن منو"
              className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)]/70 text-[var(--text-body)] transition active:scale-95 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>

        <ScrollProgress />
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-60 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="بستن منو"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col border-r border-[var(--line)] bg-[var(--surface)] shadow-2xl transition-transform duration-400 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Logo id="drawer" className="size-9" />
              <span className="text-base font-extrabold text-[var(--text-strong)]">
                {site.name}
              </span>
            </div>
            <button
              type="button"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              aria-label="بستن منو"
              className="grid size-9 place-items-center rounded-lg border border-[var(--line)] text-[var(--text-body)] active:scale-95"
            >
              <X className="size-4.5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <li
                  key={link.label}
                  className="transition-[opacity,translate] duration-400"
                  style={{
                    transitionDelay: menuOpen ? `${80 + i * 45}ms` : '0ms',
                    opacity: menuOpen ? 1 : 0,
                    translate: menuOpen ? '0' : '1.5rem 0',
                  }}
                >
                  {link.children ? (
                    <>
                      <button
                        type="button"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={() => setOpenGroup(openGroup === link.label ? null : link.label)}
                        aria-expanded={openGroup === link.label}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-[0.95rem] font-medium text-[var(--text-strong)] transition-colors hover:bg-brand-500/8"
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-4 text-[var(--text-soft)] transition-transform duration-300 ${
                            openGroup === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                        style={{
                          gridTemplateRows: openGroup === link.label ? '1fr' : '0fr',
                        }}
                      >
                        <ul className="overflow-hidden ps-3">
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <a
                                href={child.href}
                                tabIndex={menuOpen ? 0 : -1}
                                onClick={() => setMenuOpen(false)}
                                className="block rounded-lg border-r-2 border-brand-500/25 px-3 py-2.5 text-sm text-[var(--text-body)] transition-colors hover:border-brand-500 hover:text-brand-ink"
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-3 text-[0.95rem] font-medium text-[var(--text-strong)] transition-colors hover:bg-brand-500/8 hover:text-brand-ink"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2.5 border-t border-[var(--line)] p-4">
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 active:scale-98"
            >
              <Send className="size-4" />
              استعلام قیمت در تلگرام
            </a>
            <a
              href={contact.phoneHref}
              tabIndex={menuOpen ? 0 : -1}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)] active:scale-98"
            >
              <Phone className="size-4" />
              <span dir="ltr">{contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
