import { useState } from 'react'
import { Plus, Quote } from 'lucide-react'
import Avatar from './ui/Avatar'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import DetailDialog from './ui/DetailDialog'
import { useRetained } from './ui/useRetained'
import { products, testimonials } from '../data/site'

export default function Testimonials() {
  const [active, setActive] = useState(null)
  const item = useRetained(testimonials.find((t) => t.id === active))
  const product = item ? products.find((p) => p.id === item.product) : null

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="نظر مشتریان"
          title="حرف کسانی که با ما کار کرده‌اند"
          text="نمونه‌هایی از بازخورد مشتریان در حوزه‌های کشاورزی، بسته‌بندی و ساختمان. روی هر مورد بزنید تا کل ماجرا را بخوانید."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 110} className="h-full">
              <button
                type="button"
                onClick={() => setActive(t.id)}
                className="group lift-card relative flex h-full w-full flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-right hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-600/8 sm:p-7"
              >
                <Quote className="ease-soft size-8 text-brand-500/35 transition-transform duration-700 group-hover:scale-110" />

                <span className="mt-4 flex-1 text-sm leading-8 text-[var(--text-body)]">
                  {t.text}
                </span>

                <span className="ease-soft mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-ink opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                  <Plus className="size-3.5" />
                  خواندن کامل
                </span>

                <span className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <Avatar className="size-11 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold text-[var(--text-strong)]">
                      {t.name}
                    </span>
                    <span className="block text-xs text-[var(--text-soft)]">{t.role}</span>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <DetailDialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={item?.name ?? ''}
        subtitle={item?.role}
        icon={<Avatar className="size-full rounded-2xl" />}
        quote={item?.text}
        body={item?.detail}
        points={
          item
            ? [item.highlight, product ? `محصول استفاده‌شده: ${product.title}` : null].filter(
                Boolean,
              )
            : []
        }
        pointsTitle="نتیجه کار"
      />
    </section>
  )
}
