import { ArrowLeft, ImageIcon, Send } from 'lucide-react'
import ProductGlyph from './ProductGlyph'
import Reveal from './Reveal'
import { contact } from '../../data/site'

/**
 * One product tile, shared by the desktop grid and the mobile rails.
 *
 * `anchored` decides which copy owns the `id` used by the navbar and footer
 * links — the mobile rails render the same product several times (once per
 * category row), and only one of those may claim the anchor.
 */
export default function ProductCard({ product, delay = 0, anchored = true, reveal = true }) {
  // Inside the mobile rails the whole row reveals at once. Animating each card
  // as well would shift them vertically inside the horizontal scroller, which
  // reads as the cards jumping and clipping at the top.
  const Frame = reveal ? Reveal : 'div'
  const frameProps = reveal ? { delay, className: 'h-full' } : { className: 'h-full' }

  return (
    <Frame {...frameProps}>
      <article
        id={anchored ? product.id : undefined}
        className="group surface-glass lift-card relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl hover:border-brand-400/60 hover:shadow-2xl hover:shadow-brand-600/10"
      >
        {/* Illustration panel — the slot real photography will take over. */}
        <div className="relative aspect-16/10 overflow-hidden bg-linear-to-bl from-brand-500/12 via-accent-500/8 to-transparent">
          <div
            className="grid-veil absolute inset-0 opacity-60"
            style={{ maskImage: 'none' }}
            aria-hidden="true"
          />
          <ProductGlyph
            name={product.icon}
            className="ease-soft absolute inset-0 m-auto size-28 text-brand-ink transition-transform duration-[900ms] group-hover:scale-110 group-hover:-rotate-3 sm:size-32"
          />

          {product.featured && (
            <span className="absolute top-3 right-3 rounded-full bg-brand-600 px-2.5 py-1 text-[0.68rem] font-bold text-white shadow-lg shadow-brand-600/30">
              پرفروش
            </span>
          )}

          <span
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[var(--surface)]/70 px-2.5 py-1 text-[0.65rem] text-[var(--text-soft)] backdrop-blur-sm"
            title="تصویر واقعی محصول به‌زودی اضافه می‌شود"
          >
            <ImageIcon className="size-3" />
            تصویر به‌زودی
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-extrabold sm:text-xl">{product.title}</h3>
          <p className="mt-1 text-sm font-medium text-brand-ink">{product.short}</p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">{product.description}</p>

          <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/60 p-3">
            {product.specs.map((s) => (
              <div key={s.k} className="text-center">
                <dt className="text-[0.65rem] text-[var(--text-soft)]">{s.k}</dt>
                <dd className="mt-1 text-[0.72rem] leading-4 font-bold text-[var(--text-strong)]">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-4 mb-5 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[0.68rem] text-[var(--text-soft)]"
              >
                {t}
              </li>
            ))}
          </ul>

          <a
            href={contact.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="ease-soft mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/8 px-4 py-3 text-sm font-bold text-brand-ink transition-[background-color,color,border-color] duration-500 hover:bg-brand-500 hover:text-white active:scale-97 dark:hover:text-white"
          >
            <Send className="size-4" />
            استعلام قیمت این محصول
            <ArrowLeft className="ease-soft size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          </a>
        </div>
      </article>
    </Frame>
  )
}
