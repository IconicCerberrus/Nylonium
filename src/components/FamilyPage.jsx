import { ArrowUpLeft } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import CtaBand from './CtaBand'
import FloatingContact from './FloatingContact'
import PageHero from './PageHero'
import PageContent from './PageContent'
import CategorySection from './CategorySection'
import Reveal from './ui/Reveal'
import { page as pageHref } from '../lib/links'

/**
 * A product family page: title and intro, then every category in turn, a link
 * out to the full range, and finally the written section about the family.
 */
export default function FamilyPage({ page }) {
  return (
    <>
      <Navbar />

      <main>
        <PageHero
          title={page.title}
          intro={page.intro}
          glyph={page.glyph}
          crumbs={[{ label: 'خانه', href: pageHref('index.html') }, { label: page.title }]}
        />

        <div className="mx-auto max-w-7xl space-y-16 px-4 pb-16 sm:px-6 sm:space-y-20">
          {page.categories.map((category, i) => (
            <CategorySection key={category.id} category={category} pageId={page.id} index={i} />
          ))}

          <Reveal className="text-center">
            <a
              href={pageHref(page.allSlug)}
              target="_blank"
              rel="noopener"
              className="ease-soft group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/25 transition-[box-shadow,transform] duration-700 hover:shadow-2xl hover:shadow-brand-600/35 active:scale-97 sm:text-base"
            >
              مشاهده همه محصولات {page.title}
              <ArrowUpLeft className="ease-soft size-4.5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-3 text-xs text-[var(--text-soft)]">در یک تب جدید باز می‌شود</p>
          </Reveal>
        </div>

        <PageContent page={page} />

        <CtaBand />
      </main>

      <Footer />
      <FloatingContact />
    </>
  )
}
