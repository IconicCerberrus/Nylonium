import { useState } from 'react'
import { Building2, Factory, Plus, ShoppingCart, Sprout } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import DetailDialog from '../ui/DetailDialog'
import { useRetained } from '../hooks/useRetained.js'
import { industries, products } from '../data/site.js'

const ICONS = {
  sprout: Sprout,
  factory: Factory,
  building: Building2,
  cart: ShoppingCart,
}

export default function Industries() {
  const [active, setActive] = useState(null)
  const item = useRetained(industries.find((x) => x.id === active))
  const ActiveIcon = item ? (ICONS[item.icon] ?? Factory) : null

  // Turn the related product ids into readable names for the dialog.
  const related = item?.related
    ?.map((id) => products.find((p) => p.id === id)?.title)
    .filter(Boolean)

  return (
    <section id="industries" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="کاربردها"
          title="نایلون ما کجاها استفاده می‌شود"
          text="از گلخانه‌های جنوب کشور تا خطوط بسته‌بندی صنعتی و پروژه‌های عمرانی — هر صنعت نیاز متفاوتی دارد و برای هرکدام ترکیب مناسب خودش را تولید می‌کنیم. روی هر صنعت بزنید تا جزئیاتش را ببینید."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((x, i) => {
            const Icon = ICONS[x.icon] ?? Factory
            return (
              <Reveal key={x.id} delay={i * 90} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(x.id)}
                  className="group lift-card relative isolate h-full w-full overflow-hidden rounded-3xl border border-[var(--line)] p-6 text-right hover:border-brand-400/60"
                >
                  {/* Fill sweeps up from the bottom on hover */}
                  <span
                    className="ease-soft absolute inset-0 -z-10 translate-y-full bg-linear-to-t from-brand-500/14 to-transparent transition-transform duration-[800ms] group-hover:translate-y-0"
                    aria-hidden="true"
                  />

                  <Icon className="ease-soft size-9 text-brand-ink transition-transform duration-700 group-hover:-translate-y-1" />
                  <span className="mt-5 block text-base font-extrabold text-[var(--text-strong)]">
                    {x.title}
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-[var(--text-body)]">
                    {x.text}
                  </span>

                  <span className="ease-soft mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-ink opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    <Plus className="size-3.5" />
                    جزئیات
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
        title={item?.title ?? ''}
        subtitle={related?.length ? `محصولات مرتبط: ${related.join('، ')}` : undefined}
        icon={ActiveIcon ? <ActiveIcon className="size-5.5" /> : null}
        lead={item?.text}
        body={item?.detail}
        points={item?.points}
        pointsTitle="در این صنعت چه چیزی تولید می‌کنیم"
      />
    </section>
  )
}
