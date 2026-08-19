import { Building2, Factory, ShoppingCart, Sprout } from 'lucide-react'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { industries } from '../data/site'

const ICONS = {
  sprout: Sprout,
  factory: Factory,
  building: Building2,
  cart: ShoppingCart,
}

export default function Industries() {
  return (
    <section id="industries" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="کاربردها"
          title="نایلون ما کجاها استفاده می‌شود"
          text="از گلخانه‌های جنوب کشور تا خطوط بسته‌بندی صنعتی و پروژه‌های عمرانی — هر صنعت نیاز متفاوتی دارد و برای هرکدام ترکیب مناسب خودش را تولید می‌کنیم."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Factory
            return (
              <Reveal key={item.title} delay={i * 90} className="h-full">
                <div className="group lift-card relative isolate h-full overflow-hidden rounded-3xl border border-[var(--line)] p-6 hover:border-brand-400/60">
                  {/* Fill sweeps up from the bottom on hover */}
                  <span
                    className="ease-soft absolute inset-0 -z-10 translate-y-full bg-linear-to-t from-brand-500/14 to-transparent transition-transform duration-[800ms] group-hover:translate-y-0"
                    aria-hidden="true"
                  />

                  <Icon className="ease-soft size-9 text-brand-ink transition-transform duration-700 group-hover:-translate-y-1" />
                  <h3 className="mt-5 text-base font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">{item.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
