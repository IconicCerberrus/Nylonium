import { useState } from 'react'
import { Gauge, Headset, Plus, Recycle, Ruler, ShieldCheck, Truck } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import DetailDialog from '../ui/DetailDialog'
import { useRetained } from '../hooks/useRetained.js'
import { features } from '../data/site.js'

const ICONS = {
  shield: ShieldCheck,
  ruler: Ruler,
  gauge: Gauge,
  truck: Truck,
  recycle: Recycle,
  headset: Headset,
}

export default function Features() {
  const [active, setActive] = useState(null)
  const feature = useRetained(features.find((f) => f.id === active))
  const ActiveIcon = feature ? (ICONS[feature.icon] ?? ShieldCheck) : null

  return (
    <section id="why" className="relative scroll-mt-24 bg-[var(--surface-muted)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="چرا نایلونیوم"
          title="کیفیتی که در طول رول تغییر نمی‌کند"
          text="کار ما فقط تولید فیلم پلاستیکی نیست؛ کمک می‌کنیم دقیقاً همان چیزی را بگیرید که خط تولید یا پروژه شما لازم دارد — بدون اضافه‌خرید و بدون آزمون و خطا. روی هر مورد بزنید تا کامل‌تر توضیح بدهیم."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] ?? ShieldCheck
            return (
              <Reveal key={f.id} delay={(i % 3) * 90} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(f.id)}
                  className="group lift-card relative h-full w-full overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-right hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-600/8"
                >
                  {/* Corner glow that blooms on hover */}
                  <span
                    className="ease-soft pointer-events-none absolute -top-16 -left-16 size-40 rounded-full bg-brand-500/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <span className="ease-soft grid size-12 place-items-center rounded-2xl bg-linear-to-bl from-brand-500/18 to-accent-500/12 text-brand-ink transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="size-6" />
                  </span>

                  <span className="mt-5 block text-base font-extrabold text-[var(--text-strong)] sm:text-lg">
                    {f.title}
                  </span>
                  <span className="mt-2.5 block text-sm leading-7 text-[var(--text-body)]">
                    {f.text}
                  </span>

                  <span className="ease-soft mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-ink opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    <Plus className="size-3.5" />
                    توضیح بیشتر
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>

      <DetailDialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={feature?.title ?? ''}
        icon={ActiveIcon ? <ActiveIcon className="size-5.5" /> : null}
        lead={feature?.text}
        body={feature?.detail}
        points={feature?.points}
        pointsTitle="در عمل یعنی چه"
      />
    </section>
  )
}
