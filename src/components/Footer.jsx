import { ArrowUp, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import Logo from './ui/Logo'
import { contact, navLinks, products, site } from '../data/site'

const quickLinks = [
  { label: 'محصولات', href: '#products' },
  { label: 'چرا نایلونیوم', href: '#why' },
  { label: 'کاربردها', href: '#industries' },
  { label: 'فرآیند سفارش', href: '#process' },
  { label: 'سوالات پرتکرار', href: '#faq' },
  { label: 'تماس با ما', href: '#contact' },
]

export default function Footer() {
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())

  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface-muted)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-brand-500/6 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="group flex items-center gap-3">
              <Logo
                id="footer"
                className="ease-soft size-11 transition-transform duration-700 group-hover:rotate-6"
              />
              <span className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-[var(--text-strong)]">
                  {site.name}
                </span>
                <span className="mt-1 text-[0.62rem] tracking-[0.22em] text-[var(--text-soft)] uppercase">
                  {site.nameLatin}
                </span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--text-body)]">
              تولیدکننده انواع نایلون طاقه‌ای، پوشش گلخانه‌ای ضد UV، مالچ کشاورزی، شیرینک، استرچ،
              حبابی و کیسه‌های بسته‌بندی — همه در ابعاد و مشخصات سفارشی.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تلگرام"
                className="lift-chip grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] hover:border-brand-400/60 hover:text-brand-ink"
              >
                <Send className="size-4.5" />
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساپ"
                className="lift-chip grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] hover:border-brand-400/60 hover:text-brand-ink"
              >
                <MessageCircle className="size-4.5" />
              </a>
              <a
                href={contact.phoneHref}
                aria-label="تماس تلفنی"
                className="lift-chip grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-body)] hover:border-brand-400/60 hover:text-brand-ink"
              >
                <Phone className="size-4.5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <nav aria-label="محصولات">
            <h3 className="text-sm font-extrabold text-[var(--text-strong)]">محصولات</h3>
            <ul className="mt-5 space-y-2.5">
              {products.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="sweep-underline ease-soft inline-block text-sm text-[var(--text-body)] transition-colors duration-400 hover:text-brand-ink"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <nav aria-label="دسترسی سریع">
            <h3 className="text-sm font-extrabold text-[var(--text-strong)]">دسترسی سریع</h3>
            <ul className="mt-5 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="sweep-underline ease-soft inline-block text-sm text-[var(--text-body)] transition-colors duration-400 hover:text-brand-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-strong)]">راه‌های ارتباط</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-ink" />
                <a
                  href={contact.phoneHref}
                  dir="ltr"
                  className="font-semibold text-[var(--text-strong)] transition-colors hover:text-brand-ink"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-ink" />
                <a
                  href={`mailto:${contact.email}`}
                  dir="ltr"
                  className="text-[var(--text-body)] transition-colors hover:text-brand-ink"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-ink" />
                <span className="leading-7 text-[var(--text-body)]">{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[var(--line)] pt-7 sm:flex-row">
          <p className="text-center text-xs leading-6 text-[var(--text-soft)] sm:text-right">
            © {year} {site.name} — تمامی حقوق محفوظ است.
            <span className="mx-2 hidden sm:inline">·</span>
            <br className="sm:hidden" />
            این سایت صرفاً برای معرفی محصولات است و فروش آنلاین ندارد.
          </p>

          <a
            href="#top"
            className="lift-chip group flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-body)] hover:border-brand-400/60 hover:text-brand-ink"
          >
            بازگشت به بالا
            <ArrowUp className="ease-soft size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Nav mirror for crawlers — keeps every nav target in the DOM once more. */}
      <nav className="sr-only" aria-label="نقشه سایت">
        <ul>
          {navLinks
            .flatMap((l) => [l, ...(l.children ?? [])])
            .map((l) => (
              <li key={`${l.label}-${l.href}`}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
        </ul>
      </nav>
    </footer>
  )
}
