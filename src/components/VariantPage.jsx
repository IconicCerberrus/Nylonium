import { Check, ImageIcon, Send } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import CtaBand from './CtaBand'
import FloatingContact from './FloatingContact'
import PageHero from './PageHero'
import ProductGlyph from './ui/ProductGlyph'
import Reveal from './ui/Reveal'
import { useContactDialog } from './ui/contactDialogContext'
import { page as pageHref } from '../lib/links'

/**
 * Four image slots in a 2×2 block. Real photography drops into the variant's
 * `gallery` later; until then each frame carries the product's own glyph over
 * the brand wash, so the layout is already the one the photos will land in.
 */
function Gallery({ images = [], glyph }) {
  const frames = Array.from({ length: 4 }, (_, i) => images[i] ?? null)

  return (
    <div className="grid grid-cols-2 gap-3">
      {frames.map((src, i) => (
        <div
          key={src ?? i}
          className="relative aspect-4/3 overflow-hidden rounded-2xl border border-[var(--line)]"
        >
          {src ? (
            <img src={src} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 bg-linear-to-bl from-brand-500/14 via-accent-500/8 to-transparent" />
              <div
                className="grid-veil absolute inset-0 opacity-50"
                style={{ maskImage: 'none' }}
                aria-hidden="true"
              />
              <ProductGlyph
                name={glyph}
                className="absolute inset-0 m-auto size-14 text-brand-ink sm:size-16"
              />
              {i === 0 && (
                <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-[var(--surface)]/75 px-2.5 py-1 text-[0.62rem] text-[var(--text-soft)] backdrop-blur-sm">
                  <ImageIcon className="size-3" />
                  تصویر واقعی به‌زودی
                </span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * A single variant's own page.
 *
 * On a laptop the four images are floated to the left at half the measure and
 * the prose runs down their right-hand side; once the text passes the bottom
 * of the block it reclaims the full width, the way a magazine column wraps a
 * photo. Narrower screens drop the float and simply stack the two.
 */
export default function VariantPage({ page, variant }) {
  const { openContact } = useContactDialog()
  const { category } = variant
  const { features, advantages, uses } = page.content

  return (
    <>
      <Navbar />

      <main>
        <PageHero
          title={variant.title}
          intro={variant.short}
          glyph={variant.glyph}
          crumbs={[
            { label: 'خانه', href: pageHref('index.html') },
            { label: page.title, href: pageHref(page.slug) },
            { label: category.title, href: `${pageHref(page.slug)}#${category.id}` },
            { label: variant.title },
          ]}
        />

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal>
            {/* Floated at half the measure on large screens, so the prose runs
                beside the images and then flows underneath them. */}
            <div className="mb-6 lg:float-left lg:mb-4 lg:ms-8 lg:w-1/2">
              <Gallery images={variant.gallery} glyph={variant.glyph} />
            </div>

            <h2 className="text-lg font-extrabold sm:text-xl">درباره {variant.title}</h2>

            <p className="mt-4 text-sm leading-8 text-[var(--text-body)]">{category.note}</p>

            <p className="mt-4 text-sm leading-8 text-[var(--text-body)]">{page.intro}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {variant.specs.map((sp) => (
                <div
                  key={sp.k}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/60 p-4 text-center"
                >
                  <dt className="text-[0.7rem] text-[var(--text-soft)]">{sp.k}</dt>
                  <dd className="mt-1 text-sm font-bold text-[var(--text-strong)]">{sp.v}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => openContact()}
              className="ease-soft group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/25 transition-[box-shadow,transform] duration-700 hover:shadow-2xl hover:shadow-brand-600/35 active:scale-97"
            >
              <Send className="ease-soft size-4.5 transition-transform duration-500 group-hover:-translate-x-1" />
              استعلام قیمت این محصول
            </button>
          </Reveal>

          {/* Clear of the images: everything below runs the full width. */}
          <div className="clear-both space-y-12 pt-14">
            <Reveal>
              <h2 className="text-lg font-extrabold sm:text-xl">ویژگی‌های فنی</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <li
                    key={f.title}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
                  >
                    <h3 className="text-sm font-extrabold text-[var(--text-strong)]">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-[var(--text-body)]">{f.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-lg font-extrabold sm:text-xl">مزایای خرید از ما</h2>
              <ul className="mt-5 space-y-3">
                {advantages.map((a) => (
                  <li key={a.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-ink">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-7 text-[var(--text-body)]">
                      <strong className="font-bold text-[var(--text-strong)]">{a.title}</strong> —{' '}
                      {a.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-lg font-extrabold sm:text-xl">کاربردها</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {uses.map((u) => (
                  <li
                    key={u.title}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
                  >
                    <h3 className="text-sm font-extrabold text-[var(--text-strong)]">{u.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-[var(--text-body)]">{u.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <a
                href={`${pageHref(page.slug)}#${category.id}`}
                className="ease-soft inline-flex items-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-500/8 px-6 py-3.5 text-sm font-bold text-brand-ink transition-[background-color,color] duration-500 hover:bg-brand-500 hover:text-white"
              >
                بازگشت به {category.title}
              </a>
            </Reveal>
          </div>
        </div>

        <CtaBand />
      </main>

      <Footer />
      <FloatingContact />
    </>
  )
}
