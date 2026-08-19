import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { contact } from '../data/site'

const channels = [
  {
    icon: Send,
    label: 'تلگرام',
    value: 'سریع‌ترین راه ارتباط',
    href: contact.telegram,
    external: true,
    primary: true,
  },
  {
    icon: MessageCircle,
    label: 'واتساپ',
    value: 'ارسال مشخصات و تصویر',
    href: contact.whatsapp,
    external: true,
  },
  {
    icon: Phone,
    label: 'تماس تلفنی',
    value: contact.phoneDisplay,
    href: contact.phoneHref,
    ltr: true,
  },
  {
    icon: Mail,
    label: 'ایمیل',
    value: contact.email,
    href: `mailto:${contact.email}`,
    ltr: true,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="mesh-halo absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="تماس با ما"
          title="مشخصات سفارشتان را بفرستید"
          text="کاربرد، عرض، ضخامت و مقدار مورد نیازتان را بگویید تا در کوتاه‌ترین زمان قیمت و زمان تحویل را اعلام کنیم. مشاوره فنی رایگان است."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Channels */}
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`group lift-card flex h-full items-center gap-4 rounded-3xl border p-5 active:scale-98 ${
                    c.primary
                      ? 'border-brand-500/40 bg-linear-to-bl from-brand-500/14 to-accent-500/8 hover:shadow-xl hover:shadow-brand-600/15'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand-400/60'
                  }`}
                >
                  <span className="ease-soft grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/12 text-brand-ink transition-transform duration-700 group-hover:scale-110">
                    <c.icon className="size-5.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold text-[var(--text-strong)]">
                      {c.label}
                    </span>
                    <span
                      className="block truncate text-sm text-[var(--text-soft)]"
                      dir={c.ltr ? 'ltr' : undefined}
                      style={c.ltr ? { textAlign: 'start' } : undefined}
                    >
                      {c.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal delay={360} className="surface-glass rounded-3xl p-5 sm:col-span-2">
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand-ink" />
                  <span className="text-[var(--text-body)]">{contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4.5 shrink-0 text-brand-ink" />
                  <span className="text-[var(--text-body)]">{contact.hours}</span>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Inquiry checklist */}
          <Reveal
            delay={140}
            className="flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8"
          >
            <div>
              <h3 className="text-lg font-extrabold sm:text-xl">
                برای گرفتن قیمت دقیق، این‌ها را بفرستید
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">
                هرچه اطلاعات کامل‌تر باشد، قیمت و زمان تحویل دقیق‌تری اعلام می‌کنیم.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'نوع محصول (مثلاً نایلون یووی گلخانه‌ای)',
                  'عرض و طول مورد نیاز',
                  'ضخامت بر حسب میکرون',
                  'رنگ و مقدار سفارش',
                  'شهر مقصد برای محاسبه حمل',
                ].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand-500/12 text-[0.7rem] font-black text-brand-ink">
                      {i + 1}
                    </span>
                    <span className="text-[var(--text-body)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="ease-soft group mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/25 transition-[box-shadow,transform] duration-700 hover:shadow-2xl hover:shadow-brand-600/35 active:scale-97"
            >
              <Send className="ease-soft size-4.5 transition-transform duration-500 group-hover:-translate-x-1" />
              ارسال مشخصات در تلگرام
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
