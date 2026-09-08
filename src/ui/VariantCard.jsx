import { ArrowUpLeft } from 'lucide-react'
import ProductGlyph from './ProductGlyph'
import { page as pageHref } from '../lib/links.js'

/**
 * Compact tile for one variant inside a category.
 *
 * Deliberately lighter than the landing page's ProductCard: a variant differs
 * from its siblings by two numbers, so the card shows the glyph, the name and
 * exactly those numbers. The full write-up lives on the variant's own page,
 * which this opens in a new tab so the reader keeps their place in the
 * category they were browsing.
 */
export default function VariantCard({ item, glyph, href }) {
  return (
    <a
      href={pageHref(href ?? item.href ?? '#')}
      target="_blank"
      rel="noopener"
      className="group surface-glass lift-card flex h-full flex-col overflow-hidden rounded-3xl text-right hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-600/10"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-bl from-brand-500/12 via-accent-500/8 to-transparent">
        <div
          className="grid-veil absolute inset-0 opacity-60"
          style={{ maskImage: 'none' }}
          aria-hidden="true"
        />
        <ProductGlyph
          name={glyph}
          className="ease-soft absolute inset-0 m-auto size-16 text-brand-ink transition-transform duration-[900ms] group-hover:scale-110 group-hover:-rotate-3 sm:size-20"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-sm leading-6 font-extrabold text-[var(--text-strong)]">{item.title}</h4>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">{item.short}</p>

        <dl className="mt-3 space-y-1.5">
          {item.specs.map((sp) => (
            <div key={sp.k} className="flex items-baseline justify-between gap-2">
              <dt className="shrink-0 text-[0.65rem] text-[var(--text-soft)]">{sp.k}</dt>
              <dd className="truncate text-[0.7rem] font-bold text-[var(--text-strong)]">{sp.v}</dd>
            </div>
          ))}
        </dl>

        <span className="ease-soft mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-brand-ink opacity-75 transition-opacity duration-500 group-hover:opacity-100">
          مشاهده جزئیات
          <ArrowUpLeft className="ease-soft size-3 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}
