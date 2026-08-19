import { MessageCircle, Phone, Send } from 'lucide-react'
import Reveal from './ui/Reveal'
import { contact } from '../data/site'

/** Full-bleed conversion band sitting between the FAQ and the contact block. */
export default function CtaBand() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-4xl bg-linear-to-bl from-brand-700 via-brand-600 to-accent-700 px-6 py-14 text-center shadow-2xl shadow-brand-700/25 sm:rounded-5xl sm:px-12 sm:py-20">
        {/* Decorative drifting rings */}
        <svg
          viewBox="0 0 800 400"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-30"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none" stroke="white" strokeWidth="1.2">
            <circle
              cx="680"
              cy="60"
              r="120"
              strokeDasharray="4 10"
              className="animate-drift"
              style={{ transformOrigin: '680px 60px' }}
            />
            <circle cx="680" cy="60" r="180" opacity=".6" />
            <circle
              cx="120"
              cy="360"
              r="140"
              strokeDasharray="3 9"
              className="animate-drift"
              style={{
                transformOrigin: '120px 360px',
                animationDirection: 'reverse',
              }}
            />
          </g>
          <path
            d="M0 250c120-60 240-60 360 0s240 60 360 0 80-30 80-30v180H0Z"
            fill="white"
            opacity=".07"
          />
        </svg>

        <h2 className="text-[clamp(1.5rem,1.05rem+2.1vw,2.5rem)] leading-[1.4] font-black text-white">
          نمی‌دانید کدام نایلون مناسب کار شماست؟
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/85 sm:text-base">
          کاربردتان را برایمان بنویسید. کارشناس فنی ما نوع فیلم، ضخامت و ابعاد بهینه را پیشنهاد
          می‌دهد و قیمت روز را همان‌جا اعلام می‌کند — بدون هیچ هزینه‌ای.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={contact.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="lift-chip group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-brand-700 shadow-xl shadow-black/10 active:scale-97 sm:text-base"
          >
            <Send className="ease-soft size-4.5 transition-transform duration-500 group-hover:-translate-x-1" />
            گفت‌وگو در تلگرام
          </a>

          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="ease-soft inline-flex items-center justify-center gap-2 rounded-2xl border border-white/35 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-[background-color] duration-500 hover:bg-white/12 active:scale-97 sm:text-base"
          >
            <MessageCircle className="size-4.5" />
            واتساپ
          </a>

          <a
            href={contact.phoneHref}
            className="ease-soft inline-flex items-center justify-center gap-2 rounded-2xl border border-white/35 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-[background-color] duration-500 hover:bg-white/12 active:scale-97 sm:text-base"
          >
            <Phone className="size-4.5" />
            <span dir="ltr">{contact.phoneDisplay}</span>
          </a>
        </div>
      </Reveal>
    </section>
  )
}
