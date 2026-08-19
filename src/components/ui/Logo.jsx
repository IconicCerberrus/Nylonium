/**
 * Mark: three stacked film layers curling out of a roll, drawn inside a
 * rounded tile. The gradient id is suffixed so several instances (navbar,
 * footer) can coexist without clashing defs.
 */
export default function Logo({ className = '', id = 'a' }) {
  const gid = `nylonium-logo-${id}`

  return (
    <svg viewBox="0 0 44 44" className={className} role="img" aria-label="نایلونیوم">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-400)" />
          <stop offset="55%" stopColor="var(--color-brand-600)" />
          <stop offset="100%" stopColor="var(--color-accent-600)" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="42" height="42" rx="13" fill={`url(#${gid})`} />

      <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 14c6-3 12-3 18 0" strokeWidth="2.4" opacity=".55" />
        <path d="M13 21c6-3 12-3 18 0" strokeWidth="2.4" opacity=".8" />
        <path d="M13 28c6-3 12-3 18 0" strokeWidth="2.4" />
        <ellipse cx="13" cy="21" rx="3" ry="9" strokeWidth="2.4" />
      </g>
    </svg>
  )
}
