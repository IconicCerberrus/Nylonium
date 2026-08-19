import { useEffect, useState } from 'react'
import { MessageCircle, Phone, Plus, Send } from 'lucide-react'
import { contact } from '../data/site'

const actions = [
  { icon: Send, label: 'تلگرام', href: contact.telegram, external: true },
  {
    icon: MessageCircle,
    label: 'واتساپ',
    href: contact.whatsapp,
    external: true,
  },
  { icon: Phone, label: 'تماس', href: contact.phoneHref },
]

/**
 * Expandable contact dial, pinned bottom-left. Appears only after the visitor
 * has scrolled past the hero so it never covers the primary CTA.
 */
export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      className={`ease-soft fixed bottom-5 left-4 z-40 flex flex-col items-center gap-3 transition-[opacity,translate] duration-700 sm:bottom-7 sm:left-7 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <ul className="flex flex-col items-center gap-2.5">
        {actions.map((a, i) => (
          <li
            key={a.label}
            className="ease-soft transition-[opacity,translate,scale] duration-500"
            style={{
              transitionDelay: open ? `${i * 55}ms` : `${(actions.length - i) * 35}ms`,
              opacity: open ? 1 : 0,
              scale: open ? '1' : '0.6',
              translate: open ? '0' : '0 1.25rem',
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            <a
              href={a.href}
              {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={a.label}
              tabIndex={open ? 0 : -1}
              className="surface-glass lift-chip group grid size-12 place-items-center rounded-2xl text-brand-ink shadow-xl shadow-ink-950/10 hover:bg-brand-500 hover:text-white active:scale-95 dark:shadow-black/40"
            >
              <a.icon className="size-5" />
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'بستن راه‌های تماس' : 'باز کردن راه‌های تماس'}
        className="ease-soft relative grid size-14 place-items-center rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 text-white shadow-2xl shadow-brand-600/35 transition-[box-shadow,transform] duration-500 hover:shadow-brand-600/50 active:scale-95"
      >
        {!open && (
          <span
            className="animate-slow-ping absolute inset-0 rounded-2xl bg-brand-500/40"
            aria-hidden="true"
          />
        )}
        <Plus
          className={`ease-soft relative size-6 transition-transform duration-500 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </button>
    </div>
  )
}
