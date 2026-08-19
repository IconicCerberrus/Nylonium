import { Quote } from 'lucide-react'
import Avatar from './ui/Avatar'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { testimonials } from '../data/site'

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="نظر مشتریان"
          title="حرف کسانی که با ما کار کرده‌اند"
          text="نمونه‌هایی از بازخورد مشتریان در حوزه‌های کشاورزی، بسته‌بندی و ساختمان."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110} className="h-full">
              <figure className="group lift-card relative flex h-full flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-600/8 sm:p-7">
                <Quote className="ease-soft size-8 text-brand-500/35 transition-transform duration-700 group-hover:scale-110" />

                <blockquote className="mt-4 flex-1 text-sm leading-8 text-[var(--text-body)]">
                  {t.text}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <Avatar className="size-11 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold text-[var(--text-strong)]">
                      {t.name}
                    </span>
                    <span className="block text-xs text-[var(--text-soft)]">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
