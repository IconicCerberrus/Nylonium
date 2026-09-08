/**
 * Hand-drawn line-art glyphs, one per product family.
 * Purely decorative: they stand in until real product photography arrives,
 * so every glyph is aria-hidden and the card carries the accessible name.
 *
 * All paths live on a 64×64 grid and inherit `currentColor` for the stroke,
 * with a `.glyph-fill` accent that picks up the brand gradient.
 */

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths = {
  /* Wide roll seen at an angle — a broad sheet unspooling. */
  'roll-wide': (
    <>
      <ellipse cx="16" cy="26" rx="7" ry="13" {...S} />
      <path d="M16 13h32a7 13 0 0 1 0 26H16" {...S} />
      <path d="M48 39v13M16 39v13" {...S} opacity=".45" />
      <path d="M16 52c8 5 24 5 32 0" {...S} opacity=".45" />
      <ellipse cx="16" cy="26" rx="2.5" ry="5" {...S} opacity=".6" />
    </>
  ),

  /* Narrow roll — same idea, compressed. */
  'roll-narrow': (
    <>
      <ellipse cx="22" cy="24" rx="6" ry="12" {...S} />
      <path d="M22 12h20a6 12 0 0 1 0 24H22" {...S} />
      <ellipse cx="22" cy="24" rx="2" ry="4" {...S} opacity=".6" />
      <path d="M14 46h36M18 52h28" {...S} opacity=".45" />
    </>
  ),

  /* Greenhouse tunnel with a sun disc. */
  greenhouse: (
    <>
      <path d="M8 48V34a24 14 0 0 1 48 0v14" {...S} />
      <path d="M4 48h56" {...S} />
      <path d="M32 20v28M20 24v24M44 24v24" {...S} opacity=".45" />
      <circle cx="46" cy="15" r="5" {...S} />
      <path d="M46 6v2M46 22v2M55 15h2M35 15h2M52 9l1.5-1.5M39 21l1.5-1.5" {...S} opacity=".7" />
    </>
  ),

  /* Mulch film laid over raised beds with a seedling. */
  mulch: (
    <>
      <path d="M4 44c6-8 14-8 20 0s14 8 20 0 10-6 16 0" {...S} />
      <path d="M4 54c6-8 14-8 20 0s14 8 20 0 10-6 16 0" {...S} opacity=".45" />
      <path d="M32 34v-8" {...S} />
      <path d="M32 26c0-5 4-8 8-8 0 5-3 8-8 8Z" {...S} />
      <path d="M32 30c0-4-3-7-7-7 0 4 2 7 7 7Z" {...S} opacity=".7" />
    </>
  ),

  /* Colour range — overlapping swatch sheets. */
  color: (
    <>
      <rect x="8" y="18" width="30" height="30" rx="5" {...S} />
      <rect x="20" y="12" width="30" height="30" rx="5" {...S} opacity=".75" />
      <circle cx="35" cy="27" r="5" {...S} opacity=".6" />
      <path d="M12 54h40" {...S} opacity=".45" />
    </>
  ),

  /* Shrink film hugging a box, with heat arrows. */
  shrink: (
    <>
      <rect x="18" y="24" width="28" height="26" rx="4" {...S} />
      <path d="M18 32h28M32 24v26" {...S} opacity=".45" />
      <path d="M14 20c2-3 2-6 0-9M22 20c2-3 2-6 0-9M30 20c2-3 2-6 0-9" {...S} opacity=".7" />
      <path d="M50 30l6-4M50 44l6 4" {...S} opacity=".7" />
    </>
  ),

  /* Packaging bag with a folded top seam. */
  bag: (
    <>
      <path d="M16 22h32l-3 32H19L16 22Z" {...S} />
      <path d="M14 14h36l-2 8H16l-2-8Z" {...S} />
      <path d="M26 30v14M38 30v14" {...S} opacity=".45" />
    </>
  ),

  /* Bubble wrap — a sheet of air pockets. */
  bubble: (
    <>
      <rect x="10" y="12" width="44" height="40" rx="6" {...S} />
      <circle cx="21" cy="24" r="4" {...S} opacity=".8" />
      <circle cx="32" cy="24" r="4" {...S} opacity=".8" />
      <circle cx="43" cy="24" r="4" {...S} opacity=".8" />
      <circle cx="26.5" cy="40" r="4" {...S} opacity=".8" />
      <circle cx="37.5" cy="40" r="4" {...S} opacity=".8" />
    </>
  ),

  /* Stretch film wrapping a pallet. */
  stretch: (
    <>
      <path d="M18 20h28v28H18z" {...S} />
      <path d="M18 28c9 4 19 4 28 0M18 38c9 4 19 4 28 0" {...S} opacity=".6" />
      <path d="M12 54h40" {...S} />
      <path d="M18 48v6M46 48v6" {...S} opacity=".45" />
      <path d="M52 18c4 6 4 20 0 26" {...S} opacity=".7" />
    </>
  ),

  /* Nylex carry bag with cut-out handles. */
  nylex: (
    <>
      <path d="M15 20h34l-3 34H18l-3-34Z" {...S} />
      <path d="M25 20v-4a7 7 0 0 1 14 0v4" {...S} />
      <path d="M24 28h6M34 28h6" {...S} opacity=".6" />
    </>
  ),
}

export default function ProductGlyph({ name, className = '', ...rest }) {
  const shape = paths[name] ?? paths['roll-wide']

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false" {...rest}>
      {shape}
    </svg>
  )
}
