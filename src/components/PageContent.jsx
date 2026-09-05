import {
  Box,
  Building2,
  Calendar,
  Droplets,
  Eye,
  EyeOff,
  Factory,
  Flame,
  Gauge,
  Home,
  Layers,
  Leaf,
  Lightbulb,
  Link2,
  Lock,
  Move,
  Package,
  Printer,
  Ruler,
  Scissors,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Sun,
  Truck,
  Wallet,
  Warehouse,
  Wind,
  Zap,
} from 'lucide-react'
import Reveal from './ui/Reveal'
import ProductGlyph from './ui/ProductGlyph'

const ICONS = {
  box: Box,
  building: Building2,
  calendar: Calendar,
  droplets: Droplets,
  eye: Eye,
  'eye-off': EyeOff,
  factory: Factory,
  flame: Flame,
  gauge: Gauge,
  home: Home,
  layers: Layers,
  leaf: Leaf,
  lightbulb: Lightbulb,
  link: Link2,
  lock: Lock,
  move: Move,
  package: Package,
  printer: Printer,
  ruler: Ruler,
  scissors: Scissors,
  settings: Settings,
  shield: ShieldCheck,
  sparkles: Sparkles,
  sprout: Sprout,
  store: ShoppingBag,
  sun: Sun,
  truck: Truck,
  wallet: Wallet,
  warehouse: Warehouse,
  wind: Wind,
  zap: Zap,
}

function Block({ eyebrow, title, items, tone }) {
  return (
    <Reveal className="scroll-mt-28">
      <div className="flex items-baseline gap-3">
        <span className="rounded-full border border-brand-500/25 bg-brand-500/8 px-3 py-1 text-[0.68rem] font-bold text-brand-ink">
          {eyebrow}
        </span>
        <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? ShieldCheck
          return (
            <div
              key={item.title}
              className={`lift-card group relative overflow-hidden rounded-3xl border p-5 hover:border-brand-400/60 ${
                tone === 'accent'
                  ? 'border-brand-500/25 bg-linear-to-bl from-brand-500/8 to-transparent'
                  : 'border-[var(--line)] bg-[var(--surface)]'
              }`}
            >
              <span className="ease-soft grid size-11 place-items-center rounded-2xl bg-linear-to-bl from-brand-500/18 to-accent-500/12 text-brand-ink transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="size-5.5" />
              </span>

              <h3 className="mt-4 text-sm font-extrabold text-[var(--text-strong)] sm:text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">{item.text}</p>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}

/**
 * The written half of a family page: what the product is, why it is worth
 * buying, and where it gets used. Sits below every category so a reader who
 * already knows what they want never has to scroll past it — the mistake the
 * competing sites make by putting a wall of text between the buyer and the
 * grid.
 */
export default function PageContent({ page }) {
  const { features, advantages, uses } = page.content

  return (
    <section className="relative overflow-hidden bg-[var(--surface-muted)] py-20 sm:py-24">
      <div className="mesh-halo absolute inset-0 -z-10 opacity-30" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-linear-to-bl from-brand-500/20 to-accent-500/12 text-brand-ink">
            <ProductGlyph name={page.glyph} className="size-8" />
          </span>
          <h2 className="text-[clamp(1.4rem,1.1rem+1.4vw,2rem)] leading-[1.4] font-black">
            هرآنچه باید درباره {page.title} بدانید
          </h2>
          <p className="mt-4 text-sm leading-8 text-[var(--text-body)]">{page.intro}</p>
        </Reveal>

        <div className="mt-14 space-y-14">
          <Block eyebrow="ویژگی‌ها" title={`مشخصات فنی ${page.title}`} items={features} />
          <Block eyebrow="مزایا" title="چرا از ما بخرید" items={advantages} tone="accent" />
          <Block eyebrow="کاربردها" title="کجا استفاده می‌شود" items={uses} />
        </div>
      </div>
    </section>
  )
}
