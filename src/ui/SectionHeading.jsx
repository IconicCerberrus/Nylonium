import Reveal from './Reveal'

/** Shared eyebrow + title + intro block used at the top of every section. */
export default function SectionHeading({ eyebrow, title, text, align = 'center' }) {
  const centered = align === 'center'

  return (
    <Reveal className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/8 px-3.5 py-1.5 text-xs font-bold text-brand-ink`}
        >
          <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2 className="mt-5 text-[clamp(1.6rem,1.1rem+2.2vw,2.6rem)] leading-[1.35] font-black">
        {title}
      </h2>

      {text && (
        <p
          className={`mt-4 text-sm leading-8 text-[var(--text-body)] sm:text-base ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {text}
        </p>
      )}
    </Reveal>
  )
}
