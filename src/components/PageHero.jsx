import { ChevronLeft } from 'lucide-react'
import ProductGlyph from './ui/ProductGlyph'

/**
 * Centred title and short intro that opens every family page, with a
 * breadcrumb above it so the reader always knows where they are — the one
 * piece of orientation a deep product page cannot do without.
 */
export default function PageHero({ title, intro, glyph, crumbs = [] }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mesh-halo absolute inset-0 -z-20" aria-hidden="true" />
      <div className="grid-veil absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-[var(--surface)] to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-4 pt-8 pb-14 text-center sm:px-6 sm:pt-10 sm:pb-16">
        {crumbs.length > 0 && (
          <nav aria-label="مسیر صفحه" className="mb-7">
            <ol className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[var(--text-soft)]">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronLeft className="size-3 opacity-60" aria-hidden="true" />}
                  {c.href ? (
                    <a
                      href={c.href}
                      className="ease-soft transition-colors duration-400 hover:text-brand-ink"
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-[var(--text-body)]">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {glyph && (
          <span className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-linear-to-bl from-brand-500/20 to-accent-500/12 text-brand-ink">
            <ProductGlyph name={glyph} className="size-9" />
          </span>
        )}

        <h1 className="text-[clamp(1.7rem,1.2rem+2.4vw,2.75rem)] leading-[1.35] font-black">
          {title}
        </h1>

        {intro && (
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[var(--text-body)] sm:text-base">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
