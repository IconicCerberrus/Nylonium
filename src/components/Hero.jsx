import { ArrowLeft, MessageCircle, Phone, Send, Sparkles } from 'lucide-react'
import { contact, products } from '../data/site'

/**
 * Animated film stack: three translucent sheets drifting over each other,
 * standing in for product photography. Motion is pure CSS so it costs nothing
 * on the main thread and stops entirely under prefers-reduced-motion.
 */
function FilmArtwork() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="size-full drop-shadow-2xl"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sheet-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-300)" stopOpacity=".85" />
          <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id="sheet-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity=".7" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id="sheet-c" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity=".6" />
          <stop offset="100%" stopColor="var(--color-brand-200)" stopOpacity=".2" />
        </linearGradient>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity=".5" />
          <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="260" cy="260" r="230" fill="url(#core-glow)" />

      {/* Concentric guide rings */}
      <g
        fill="none"
        stroke="currentColor"
        className="text-brand-500/18"
        style={{ transformOrigin: '260px 260px' }}
      >
        <circle cx="260" cy="260" r="200" strokeDasharray="3 9" className="animate-drift" />
        <circle cx="260" cy="260" r="160" />
        <circle cx="260" cy="260" r="120" strokeDasharray="2 7" />
      </g>

      {/* Three drifting film sheets */}
      <g className="animate-float" style={{ animationDelay: '-1s' }}>
        <path
          d="M70 190c60-42 130-42 190 0s130 42 190 0v78c-60 42-130 42-190 0s-130-42-190 0Z"
          fill="url(#sheet-a)"
        />
      </g>
      <g className="animate-float" style={{ animationDelay: '-3.5s' }}>
        <path
          d="M70 262c60-42 130-42 190 0s130 42 190 0v62c-60 42-130 42-190 0s-130-42-190 0Z"
          fill="url(#sheet-b)"
        />
      </g>
      <g className="animate-float" style={{ animationDelay: '-6s' }}>
        <path
          d="M70 330c60-42 130-42 190 0s130 42 190 0v52c-60 42-130 42-190 0s-130-42-190 0Z"
          fill="url(#sheet-c)"
        />
      </g>

      {/* Roll core */}
      <g fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-600/70">
        <ellipse cx="86" cy="170" rx="16" ry="46" />
        <path d="M86 124h340" strokeOpacity=".35" />
      </g>
    </svg>
  )
}

/** Small floating glass chip used to label parts of the artwork. */
function SpecChip({ children, className = '', delay = '0s' }) {
  return (
    <div
      className={`surface-glass animate-float absolute rounded-2xl px-3.5 py-2.5 shadow-xl shadow-ink-950/10 dark:shadow-black/40 ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  )
}

export default function Hero() {
  const highlights = products.filter((p) => p.featured).slice(0, 3)

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Layered backdrop */}
      <div className="mesh-halo absolute inset-0 -z-20" aria-hidden="true" />
      <div className="grid-veil absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-[var(--surface)] to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-20 lg:pb-28">
        {/* Copy column */}
        <div className="relative z-10 text-center lg:text-right">
          <p className="surface-glass inline-flex items-center gap-2 rounded-full py-1.5 ps-4 pe-2.5 text-xs font-medium text-[var(--text-body)] sm:text-sm">
            <Sparkles className="size-3.5 text-brand-ink" />
            تولید سفارشی در عرض، ضخامت و رنگ دلخواه
          </p>

          <h1 className="mt-6 text-[clamp(2rem,1.2rem+4.4vw,3.85rem)] leading-[1.22] font-black">
            هر نوع نایلونی که کارتان لازم دارد،
            <br className="hidden sm:block" />
            <span className="text-gradient">دقیقاً به اندازه‌ای که می‌خواهید</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--text-body)] sm:text-lg lg:mx-0">
            نایلونیوم از رول طاقه‌ای عریض و پوشش گلخانه‌ای ضد UV تا شیرینک، استرچ، حبابی و انواع
            کیسه بسته‌بندی را تولید می‌کند. مشخصات مورد نیازتان را بگویید؛ همان را می‌سازیم و در
            سریع‌ترین زمان به دستتان می‌رسانیم.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="ease-soft group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-l from-brand-600 to-brand-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-brand-600/30 transition-[box-shadow,transform] duration-700 hover:shadow-2xl hover:shadow-brand-600/40 active:scale-97 sm:text-base"
            >
              <span
                className="ease-soft absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full"
                aria-hidden="true"
              />
              <Send className="size-4.5" />
              استعلام قیمت در تلگرام
              <ArrowLeft className="ease-soft size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            </a>

            <a
              href="#products"
              className="ease-soft inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)]/60 px-7 py-4 text-sm font-bold text-[var(--text-strong)] backdrop-blur-sm transition-[border-color,color] duration-500 hover:border-brand-400/70 hover:text-brand-ink active:scale-97 sm:text-base"
            >
              مشاهده محصولات
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--text-soft)] lg:justify-start">
            <a
              href={contact.phoneHref}
              className="flex items-center gap-2 transition-colors hover:text-brand-ink"
            >
              <Phone className="size-4" />
              <span dir="ltr" className="font-semibold">
                {contact.phoneDisplay}
              </span>
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-brand-ink"
            >
              <MessageCircle className="size-4" />
              واتساپ
            </a>
            <span className="hidden items-center gap-2 sm:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
              </span>
              آماده پاسخگویی
            </span>
          </div>
        </div>

        {/* Artwork column */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square">
            <FilmArtwork />

            <SpecChip className="top-[6%] right-[2%] sm:right-[-4%]" delay="-2s">
              <p className="text-[0.7rem] text-[var(--text-soft)]">عرض تولید</p>
              <p className="text-sm font-bold text-[var(--text-strong)]">تا ۱۴ متر</p>
            </SpecChip>

            <SpecChip className="bottom-[26%] left-[0%] sm:left-[-5%]" delay="-5s">
              <p className="text-[0.7rem] text-[var(--text-soft)]">بازه ضخامت</p>
              <p className="text-sm font-bold text-[var(--text-strong)]">۱۲ تا ۴۰۰ میکرون</p>
            </SpecChip>

            <SpecChip className="top-[44%] left-[4%] hidden sm:block" delay="-7.5s">
              <p className="text-[0.7rem] text-[var(--text-soft)]">پوشش گلخانه</p>
              <p className="text-sm font-bold text-brand-ink">ضد UV</p>
            </SpecChip>
          </div>

          {/* Featured product shortcuts */}
          <ul className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
            {highlights.map((p) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="surface-glass lift-chip block h-full rounded-2xl px-3 py-3 text-center hover:border-brand-400/60"
                >
                  <span className="block text-[0.72rem] leading-5 font-semibold text-[var(--text-strong)] sm:text-xs">
                    {p.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
