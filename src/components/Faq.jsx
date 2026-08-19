import { Plus } from 'lucide-react'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { contact, faq } from '../data/site'

/**
 * Native <details> accordion — keyboard accessible and findable by in-page
 * search for free. The open/close height transition is handled in index.css
 * via ::details-content, and degrades to an instant toggle where unsupported.
 */
export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--surface-muted)] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            align="start"
            eyebrow="سوالات پرتکرار"
            title="چیزهایی که بیشتر از ما می‌پرسند"
            text="اگر جواب سوالتان اینجا نبود، در تلگرام بپرسید — معمولاً در کمتر از یک ساعت پاسخ می‌دهیم."
          />

          <Reveal delay={150} className="mt-8">
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="ease-soft inline-flex items-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-500/8 px-5 py-3 text-sm font-bold text-brand-ink transition-[background-color,color] duration-500 hover:bg-brand-500 hover:text-white active:scale-97 dark:hover:text-white"
            >
              پرسیدن سوال در تلگرام
            </a>
          </Reveal>
        </div>

        <ul className="space-y-3">
          {faq.map((item, i) => (
            <Reveal as="li" key={item.q} delay={i * 80}>
              <details className="faq-item group rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition-colors duration-300 open:border-brand-400/50 hover:border-brand-400/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold text-[var(--text-strong)] sm:text-base [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    className="ease-soft size-4.5 shrink-0 text-brand-ink transition-transform duration-500 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>

                <p className="px-5 pb-5 text-sm leading-8 text-[var(--text-body)]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
