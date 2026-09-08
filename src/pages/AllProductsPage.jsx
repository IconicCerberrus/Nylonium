import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import FloatingContact from '../layout/FloatingContact'
import PageHero from '../sections/PageHero'
import VariantCard from '../ui/VariantCard'
import Reveal from '../ui/Reveal'
import { allVariants } from '../data/pages.js'
import { page as pageHref } from '../lib/links.js'

/** How many tiles appear before the reader asks for more. */
const PAGE_SIZE = 9

/** Counts are shown in Persian digits, like every other figure on the site. */
const fa = new Intl.NumberFormat('fa-IR')

/**
 * The full range for one family, and nothing else.
 *
 * This view drops the written section on purpose: someone who followed the
 * "see everything" link already knows what the family is and came to compare
 * the variants, so the page is a title, an intro line and the grid.
 *
 * Tiles arrive nine at a time rather than all at once, which keeps the first
 * paint small and the page from turning into an endless scroll.
 */
export default function AllProductsPage({ page }) {
  const items = useMemo(() => allVariants(page), [page])
  const [shown, setShown] = useState(PAGE_SIZE)

  const visible = items.slice(0, shown)
  const remaining = items.length - shown

  return (
    <>
      <Navbar />

      <main>
        <PageHero
          title={`همه محصولات ${page.title}`}
          intro={page.intro}
          glyph={page.glyph}
          crumbs={[
            { label: 'خانه', href: pageHref('index.html') },
            { label: page.title, href: pageHref(page.slug) },
            { label: 'همه محصولات' },
          ]}
        />

        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <p className="mb-6 text-center text-sm text-[var(--text-soft)]">
            نمایش {fa.format(visible.length)} محصول از {fa.format(items.length)}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((item) => (
              <Reveal key={item.id} className="h-full">
                <VariantCard item={item} glyph={item.glyph} href={item.href} />
              </Reveal>
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="ease-soft group inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-500/8 px-7 py-3.5 text-sm font-bold text-brand-ink transition-[background-color,color] duration-500 hover:bg-brand-500 hover:text-white active:scale-97"
              >
                مشاهده بیشتر
                <ChevronDown className="ease-soft size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
              </button>
              <p className="mt-3 text-xs text-[var(--text-soft)]">
                {fa.format(remaining)} محصول دیگر باقی مانده است
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingContact />
    </>
  )
}
