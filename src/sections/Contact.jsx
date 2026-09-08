import { ChevronLeft, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useContactDialog } from '../context/contactDialogContext.js'
import { contactChannels } from '../data/site.js'

const ICONS = {
  phone: Phone,
  telegram: Send,
  whatsapp: MessageCircle,
  email: Mail,
}

export default function Contact() {
  const { openContact } = useContactDialog()

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="mesh-halo absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="تماس با ما"
          title="مشخصات سفارشتان را بفرستید"
          text="کاربرد، عرض، ضخامت و مقدار مورد نیازتان را بگویید تا در کوتاه‌ترین زمان قیمت و زمان تحویل را اعلام کنیم. مشاوره فنی رایگان است."
        />

        {/* Two equal columns: the four channels on one side, the checklist on
            the other. `items-stretch` keeps both blocks the same height so the
            channel grid lines up with the checklist card beside it. */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contactChannels.map((c, i) => {
              const Icon = ICONS[c.icon] ?? Phone
              return (
                <Reveal key={c.id} delay={i * 90} className="h-full">
                  <button
                    type="button"
                    onClick={() => openContact(c.id, 'all')}
                    className={`group lift-card flex h-full w-full flex-col justify-between gap-5 rounded-3xl border p-5 text-right active:scale-98 ${
                      c.primary
                        ? 'border-brand-500/40 bg-linear-to-bl from-brand-500/14 to-accent-500/8 hover:shadow-xl hover:shadow-brand-600/15'
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand-400/60'
                    }`}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="ease-soft grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/12 text-brand-ink transition-transform duration-700 group-hover:scale-110">
                        <Icon className="size-5.5" />
                      </span>
                      {c.primary && (
                        <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[0.62rem] font-bold text-brand-ink">
                          پیشنهاد ما
                        </span>
                      )}
                    </span>

                    <span className="block">
                      <span className="block text-sm font-extrabold text-[var(--text-strong)]">
                        {c.label}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--text-soft)]">{c.note}</span>

                      <span className="ease-soft mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-ink opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                        مشاهده
                        <ChevronLeft className="ease-soft size-3.5 transition-transform duration-500 group-hover:-translate-x-0.5" />
                      </span>
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </div>

          {/* Inquiry checklist */}
          <Reveal delay={140} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
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

              <button
                type="button"
                onClick={() => openContact()}
                className="ease-soft group mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/25 transition-[box-shadow,transform] duration-700 hover:shadow-2xl hover:shadow-brand-600/35 active:scale-97"
              >
                <Send className="ease-soft size-4.5 transition-transform duration-500 group-hover:-translate-x-1" />
                استعلام قیمت
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
