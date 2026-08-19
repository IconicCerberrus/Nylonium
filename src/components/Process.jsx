import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { process } from '../data/site'

/**
 * Four-step order flow. On large screens the steps sit on a horizontal rail;
 * below that they stack into a vertical timeline so nothing gets cramped.
 */
export default function Process() {
  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--surface-muted)] py-20 sm:py-28"
    >
      <div className="mesh-halo absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="فرآیند سفارش"
          title="از پیام تا تحویل، در چهار قدم"
          text="سفارش گرفتن پیچیده نیست. کافی است بگویید چه می‌خواهید؛ بقیه مسیر را ما هماهنگ می‌کنیم."
        />

        <ol className="relative mt-16 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {/* Rail — horizontal on desktop, vertical on mobile */}
          <span
            className="absolute top-6 right-6 bottom-6 w-px bg-linear-to-b from-brand-500/40 via-brand-500/20 to-transparent lg:top-6 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-linear-to-l lg:from-brand-500/40 lg:via-brand-500/25 lg:to-transparent"
            aria-hidden="true"
          />

          {process.map((step, i) => (
            <Reveal
              as="li"
              key={step.step}
              delay={i * 110}
              className="group relative ps-16 lg:ps-0"
            >
              <span className="ease-soft absolute top-0 right-0 grid size-12 place-items-center rounded-2xl border border-brand-500/30 bg-[var(--surface)] text-sm font-black text-brand-ink shadow-lg shadow-brand-600/10 transition-transform duration-700 group-hover:scale-110 lg:relative lg:mb-5">
                {step.step}
              </span>

              <h3 className="text-base font-extrabold sm:text-lg">{step.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--text-body)]">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
