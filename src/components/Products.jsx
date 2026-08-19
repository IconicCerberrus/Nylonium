import { useMemo, useState } from 'react'
import ProductCard from './ui/ProductCard'
import ProductRail from './ProductRail'
import SectionHeading from './ui/SectionHeading'
import { useMediaQuery } from './ui/useMediaQuery'
import { products } from '../data/site'

const CATEGORIES = [
  { id: 'all', label: 'همه محصولات' },
  { id: 'کشاورزی', label: 'کشاورزی' },
  { id: 'بسته‌بندی', label: 'بسته‌بندی' },
  { id: 'صنعتی', label: 'صنعتی' },
  { id: 'کیسه', label: 'کیسه' },
]

const itemsFor = (id) => (id === 'all' ? products : products.filter((p) => p.tags.includes(id)))

/** Desktop and up: filter chips over a responsive grid. */
function ProductGrid() {
  const [filter, setFilter] = useState('all')
  const visible = useMemo(() => itemsFor(filter), [filter])

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const active = filter === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              aria-pressed={active}
              className={`lift-chip rounded-full px-4 py-2 text-sm font-semibold active:scale-95 ${
                active
                  ? 'bg-linear-to-l from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25'
                  : 'border border-[var(--line)] text-[var(--text-body)] hover:border-brand-400/60 hover:text-brand-ink'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={(i % 3) * 90} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-[var(--text-soft)]">
          محصولی در این دسته یافت نشد.
        </p>
      )}
    </>
  )
}

/**
 * Phones get one swipeable rail per category instead of the filter control —
 * every group is already on screen, so nothing has to be tapped to be found.
 * The "all" rail owns the product anchors since it is the only row that
 * contains each product exactly once.
 */
function ProductRails() {
  return (
    <div className="mt-8">
      {CATEGORIES.map((c) => (
        <ProductRail
          key={c.id}
          title={c.label}
          items={itemsFor(c.id)}
          anchorOwner={c.id === 'all'}
        />
      ))}
    </div>
  )
}

export default function Products() {
  const isPhone = useMediaQuery('(max-width: 639px)')

  return (
    <section id="products" className="relative scroll-mt-24 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-brand-500/6 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="محصولات"
          title="ده گروه محصول، همه در ابعاد سفارشی"
          text="هر محصول با عرض، ضخامت و رنگ دلخواه شما تولید می‌شود. مشخصات درج‌شده بازه استاندارد تولید ماست؛ برای نیازهای خارج از این بازه هم با ما تماس بگیرید."
        />

        {isPhone ? <ProductRails /> : <ProductGrid />}
      </div>
    </section>
  )
}
