/**
 * Neutral person mark used for customer quotes. Deliberately generic — these
 * are stand-ins until real names and photos are supplied.
 */
export default function Avatar({ className = '' }) {
  return (
    <span
      className={`grid place-items-center rounded-2xl bg-linear-to-bl from-brand-500/20 to-accent-500/12 text-brand-ink ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="8.5" r="3.6" />
        <path d="M4.8 19.4a7.4 7.4 0 0 1 14.4 0" />
      </svg>
    </span>
  )
}
