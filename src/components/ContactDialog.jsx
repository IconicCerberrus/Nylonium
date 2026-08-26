import { useCallback, useMemo, useState } from 'react'
import { ChevronDown, ExternalLink, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import Modal from './ui/Modal'
import { ContactDialogContext } from './ui/contactDialogContext'
import { contactChannels, quoteChannels } from '../data/site'

const ICONS = {
  phone: Phone,
  telegram: Send,
  whatsapp: MessageCircle,
  email: Mail,
}

/**
 * One collapsible channel. Opening it reveals the actual numbers rather than
 * navigating straight away — the visitor may simply be checking what is on
 * offer, and there may be more than one line to choose between.
 */
function ChannelRow({ channel, expanded, onToggle }) {
  const Icon = ICONS[channel.icon] ?? Phone

  return (
    <li>
      <div
        className={`ease-soft overflow-hidden rounded-2xl border transition-[border-color,background-color] duration-400 ${
          expanded
            ? 'border-brand-400/60 bg-brand-500/6'
            : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand-400/50'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full items-center gap-4 p-4 text-right"
        >
          <span
            className={`ease-soft grid size-11 shrink-0 place-items-center rounded-2xl transition-[background-color,transform] duration-500 ${
              expanded ? 'scale-105 bg-brand-500 text-white' : 'bg-brand-500/12 text-brand-ink'
            }`}
          >
            <Icon className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[var(--text-strong)]">
                {channel.label}
              </span>
              {channel.primary && (
                <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[0.62rem] font-bold text-brand-ink">
                  پیشنهاد ما
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-xs text-[var(--text-soft)]">{channel.note}</span>
          </span>

          <ChevronDown
            className={`ease-soft size-4.5 shrink-0 text-[var(--text-soft)] transition-transform duration-400 ${
              expanded ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {/* 0fr → 1fr keeps the reveal animated without measuring pixel heights. */}
        <div
          className="ease-soft grid transition-[grid-template-rows] duration-400"
          style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2 px-4 pb-4">
              {channel.entries.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    tabIndex={expanded ? 0 : -1}
                    className="ease-soft group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition-[border-color,background-color] duration-400 hover:border-brand-400/70 hover:bg-brand-500/8 active:scale-98"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] text-[var(--text-soft)]">
                        {entry.label}
                      </span>
                      <span
                        className="mt-0.5 block truncate text-sm font-bold text-[var(--text-strong)]"
                        dir={entry.ltr ? 'ltr' : undefined}
                        style={entry.ltr ? { textAlign: 'start' } : undefined}
                      >
                        {entry.value}
                      </span>
                    </span>
                    <ExternalLink
                      className="ease-soft size-4 shrink-0 text-[var(--text-soft)] transition-[color,transform] duration-400 group-hover:-translate-x-0.5 group-hover:text-brand-ink"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  )
}

/**
 * Owns the single contact dialog for the whole page and exposes `openContact`
 * through context, so the navbar, hero, CTA band and contact cards all drive
 * the same instance instead of each rendering their own.
 */
export default function ContactDialogProvider({ children }) {
  const [state, setState] = useState({ open: false, focus: null, scope: 'quote' })
  const [expanded, setExpanded] = useState(null)

  const openContact = useCallback((focus = null, scope = 'quote') => {
    setState({ open: true, focus, scope })
    setExpanded(focus)
  }, [])

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const channels = state.scope === 'all' ? contactChannels : quoteChannels

  const value = useMemo(() => ({ openContact }), [openContact])

  return (
    <ContactDialogContext.Provider value={value}>
      {children}

      <Modal
        open={state.open}
        onClose={close}
        title="استعلام قیمت و تماس"
        subtitle="راه ارتباطی را انتخاب کنید"
        icon={<Send className="size-5.5" />}
        footer={
          <p className="text-center text-xs leading-6 text-[var(--text-soft)]">
            کاربرد، عرض، ضخامت و مقدار مورد نیازتان را بفرستید تا قیمت روز و زمان تحویل را اعلام
            کنیم. مشاوره فنی رایگان است.
          </p>
        }
      >
        <ul className="space-y-3">
          {channels.map((channel) => (
            <ChannelRow
              key={channel.id}
              channel={channel}
              expanded={expanded === channel.id}
              onToggle={() => setExpanded((c) => (c === channel.id ? null : channel.id))}
            />
          ))}
        </ul>
      </Modal>
    </ContactDialogContext.Provider>
  )
}
