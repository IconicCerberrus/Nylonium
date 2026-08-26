import { Check, ImageIcon, Send } from 'lucide-react'
import Modal from './Modal'
import ProductGlyph from './ProductGlyph'
import { useContactDialog } from './contactDialogContext'

/**
 * Placeholder image column. Real photography drops into `gallery` later; until
 * then each frame shows the subject's own glyph over the brand wash, so the
 * layout is already the one the photos will land in.
 */
function Gallery({ images, glyph }) {
  const hasImages = images.length > 0
  const hero = hasImages ? images[0] : null
  const rest = hasImages ? images.slice(1, 3) : [0, 1]

  const Frame = ({ src, size, badge }) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--line)] ${
        size === 'hero' ? 'aspect-4/3' : 'aspect-3/2'
      }`}
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
          {glyph && (
            <ProductGlyph
              name={glyph}
              className={`absolute inset-0 m-auto text-brand-ink ${
                size === 'hero' ? 'size-20' : 'size-10'
              }`}
            />
          )}
          {badge && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-[var(--surface)]/75 px-2.5 py-1 text-[0.62rem] text-[var(--text-soft)] backdrop-blur-sm">
              <ImageIcon className="size-3" />
              تصویر واقعی به‌زودی
            </span>
          )}
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-2">
      <Frame src={hero} size="hero" badge />
      <div className="grid grid-cols-2 gap-2">
        {rest.map((src, i) => (
          <Frame key={hasImages ? src : i} src={hasImages ? src : null} />
        ))}
      </div>
    </div>
  )
}

/**
 * Shared pop-up body for products, process steps, capabilities, industries and
 * customer quotes. Every section is optional, so one component covers all five
 * without any of them growing a bespoke dialog.
 *
 * When there are images, the column is floated to the left and the prose runs
 * down its right-hand side; once the text passes the bottom of the images it
 * reclaims the full width, the way a magazine column wraps a photo. On phones
 * the float is dropped and the two simply stack.
 */
export default function DetailDialog({
  open,
  onClose,
  icon,
  title,
  subtitle,
  lead,
  body,
  points,
  pointsTitle = 'نکته‌های کلیدی',
  meta,
  gallery,
  glyph,
  quote,
  cta = true,
}) {
  const { openContact } = useContactDialog()
  const hasGallery = Boolean(gallery || glyph)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      footer={
        cta ? (
          <button
            type="button"
            // Deliberately leaves this dialog open: the contact panel stacks
            // on top, so closing it returns the reader to what they were
            // reading instead of dumping them back on the page.
            onClick={() => openContact()}
            className="ease-soft group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-[box-shadow,transform] duration-500 hover:shadow-xl hover:shadow-brand-600/35 active:scale-98"
          >
            <Send className="ease-soft size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            استعلام قیمت
          </button>
        ) : null
      }
    >
      {hasGallery && (
        // float-left in an RTL panel puts the images on the left and lets the
        // paragraphs flow along their right edge. `ms-*` is the inline-start
        // margin, which resolves to the right — the gap facing the text.
        <div className="mb-4 sm:float-left sm:mb-3 sm:ms-5 sm:w-[42%]">
          <Gallery images={gallery ?? []} glyph={glyph} />
        </div>
      )}

      {quote && (
        <blockquote className="mb-5 rounded-2xl border-r-2 border-brand-500 bg-brand-500/6 px-4 py-3 text-sm leading-8 text-[var(--text-body)]">
          {quote}
        </blockquote>
      )}

      {lead && <p className="mb-4 text-sm leading-8 text-[var(--text-body)]">{lead}</p>}

      {body && <p className="mb-4 text-sm leading-8 text-[var(--text-body)]">{body}</p>}

      {/* Everything below runs the full width again, clear of the images. */}
      <div className="clear-both space-y-6 pt-2">
        {meta?.length > 0 && (
          <dl className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/60 p-3">
            {meta.map((m) => (
              <div key={m.k} className="text-center">
                <dt className="text-[0.65rem] text-[var(--text-soft)]">{m.k}</dt>
                <dd className="mt-1 text-[0.75rem] leading-5 font-bold text-[var(--text-strong)]">
                  {m.v}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {points?.length > 0 && (
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-strong)]">{pointsTitle}</h3>
            <ul className="mt-3 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-7 text-[var(--text-body)]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  )
}
