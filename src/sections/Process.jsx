import { useState } from 'react'
import { ClipboardCheck, Factory, MessageSquare, Truck } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import DetailDialog from '../ui/DetailDialog'
import { useRetained } from '../hooks/useRetained.js'
import { process } from '../data/site.js'

const ICONS = {
  message: MessageSquare,
  clipboard: ClipboardCheck,
  factory: Factory,
  truck: Truck,
}

/**
 * Four-step order flow. On large screens the steps sit on a horizontal rail;
 * below that they stack into a vertical timeline so nothing gets cramped.
 *
 * Only the numbered badge is interactive — the surrounding text stays plain,
 * so the hover state points at exactly the thing that can be clicked instead
 * of lighting up the whole column. Hovering lifts the badge a little and
 * lowers it again on the way out; nothing swaps or repaints, which is what
 * made the earlier version flicker.
 */
export default function Process() {
  const [active, setActive] = useState(null)
  const step = useRetained(process.find((s) => s.id === active))
  const ActiveIcon = step ? (ICONS[step.icon] ?? MessageSquare) : null

  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--surface-muted)] py-20 sm:py-28"
    >
      <div className="mesh-halo absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="فرآیند سفارش"
          title="از پیام تا تحویل، در چهار قدم"
          text="سفارش گرفتن پیچیده نیست. کافی است بگویید چه می‌خواهید؛ بقیه مسیر را ما هماهنگ می‌کنیم. روی شماره هر مرحله بزنید تا جزئیاتش را ببینید."
        />

        <ol className="relative mt-16 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {/* Rail — horizontal on desktop, vertical on mobile */}
          <span
            className="absolute top-6 right-6 bottom-6 w-px bg-linear-to-b from-brand-500/40 via-brand-500/20 to-transparent lg:top-6 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-linear-to-l lg:from-brand-500/40 lg:via-brand-500/25 lg:to-transparent"
            aria-hidden="true"
          />

          {process.map((s, i) => {
            const Icon = ICONS[s.icon] ?? MessageSquare
            return (
              <Reveal as="li" key={s.id} delay={i * 110} className="relative ps-16 lg:ps-0">
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-label={`جزئیات قدم ${s.step} — ${s.title}`}
                  className="ease-soft absolute top-0 right-0 grid size-12 place-items-center rounded-2xl border border-brand-500/30 bg-[var(--surface)] text-sm font-black text-brand-ink shadow-lg shadow-brand-600/10 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-600/25 active:translate-y-0 lg:relative lg:mb-5"
                >
                  {s.step}
                </button>

                <h3 className="flex items-center gap-2 text-base font-extrabold sm:text-lg">
                  <Icon className="size-4.5 shrink-0 text-brand-ink" />
                  {s.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--text-body)]">{s.text}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>

      <DetailDialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={step ? `قدم ${step.step} — ${step.title}` : ''}
        subtitle={step?.duration ? `زمان تقریبی: ${step.duration}` : undefined}
        icon={ActiveIcon ? <ActiveIcon className="size-5.5" /> : null}
        lead={step?.text}
        body={step?.detail}
        points={step?.points}
        pointsTitle="در این مرحله چه اتفاقی می‌افتد"
      />
    </section>
  )
}
