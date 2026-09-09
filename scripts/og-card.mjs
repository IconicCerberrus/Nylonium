/**
 * Builds the 1200×630 card that Telegram, WhatsApp and search engines show
 * when a link to the site is shared.
 *
 * It matters more here than it would on most sites: nothing is sold on the
 * site, so every conversation starts with a link pasted into a chat. Without
 * an image that link renders as two lines of grey text.
 *
 * Drawn as SVG and rasterised at build time rather than kept as a binary in
 * the repository, so the wording and the brand colours have exactly one
 * source. Vazirmatn is handed to the renderer explicitly — the Persian text
 * needs Arabic shaping, and there is no guarantee about the fonts installed
 * on whichever machine runs the build.
 *
 * Every string on the card is Persian on purpose. Fontsource ships Vazirmatn
 * as three subset files that all declare the same family name, so the
 * renderer resolves the family to one of them and Latin characters come out
 * of the Arabic subset as garbage rather than as letters. Keeping the card
 * Persian sidesteps that entirely; if a Latin line is ever wanted here, it
 * needs a font file that carries both scripts.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const WIDTH = 1200
const HEIGHT = 630

/** The logo mark, scaled and positioned by the caller. */
const mark = (x, y, size) => `
  <g transform="translate(${x} ${y}) scale(${size / 44})">
    <rect x="1" y="1" width="42" height="42" rx="13" fill="rgba(255,255,255,0.14)"
          stroke="rgba(255,255,255,0.35)" stroke-width="1" />
    <g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 14c6-3 12-3 18 0" opacity=".55" />
      <path d="M13 21c6-3 12-3 18 0" opacity=".8" />
      <path d="M13 28c6-3 12-3 18 0" />
      <ellipse cx="13" cy="21" rx="3" ry="9" />
    </g>
  </g>`

/**
 * `direction: rtl` is not something every SVG renderer honours, so nothing
 * here relies on it. Each line is anchored at its right edge with
 * `text-anchor: end` instead, which lays Persian out correctly whether or not
 * the renderer understands bidi — the shaping inside a run is the font's job
 * and is handled either way.
 */
function card({ name, tagline, families, phone, footnote }) {
  const right = WIDTH - 80

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#065f46" />
      <stop offset="55%" stop-color="#047857" />
      <stop offset="100%" stop-color="#0e7490" />
    </linearGradient>
    <radialGradient id="halo" cx="0.82" cy="0.12" r="0.7">
      <stop offset="0%" stop-color="#34d399" stop-opacity=".45" />
      <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="halo2" cx="0.1" cy="0.95" r="0.6">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity=".33" />
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#halo)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#halo2)" />

  <!-- The three film layers of the logo, blown up as a watermark. -->
  <g fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="14" stroke-linecap="round">
    <path d="M-40 470c220-120 440-120 660 0s440 120 660 0" />
    <path d="M-40 550c220-120 440-120 660 0s440 120 660 0" />
    <path d="M-40 630c220-120 440-120 660 0s440 120 660 0" />
  </g>

  ${mark(right - 92, 74, 92)}

  <text x="${right}" y="248" text-anchor="end" font-family="Vazirmatn Variable, Vazirmatn"
        font-size="92" font-weight="800" fill="#ffffff">${name}</text>

  <text x="${right}" y="330" text-anchor="end" font-family="Vazirmatn Variable, Vazirmatn"
        font-size="38" font-weight="500" fill="#d1fae5">${tagline}</text>

  <g font-family="Vazirmatn Variable, Vazirmatn" font-size="30" font-weight="600" fill="#ffffff">
    ${families
      .map((label, i) => {
        // Laid out right to left, the direction the rest of the site reads in.
        const w = label.length * 17 + 44
        const x = right - families.slice(0, i).reduce((s, l) => s + l.length * 17 + 44 + 14, 0) - w
        return `<g>
      <rect x="${x}" y="392" width="${w}" height="58" rx="18"
            fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.28)" stroke-width="1" />
      <text x="${x + w / 2}" y="430" text-anchor="middle" fill="#ecfdf5">${label}</text>
    </g>`
      })
      .join('')}
  </g>

  <text x="${right}" y="556" text-anchor="end" font-family="Vazirmatn Variable, Vazirmatn"
        font-size="34" font-weight="700" fill="#ffffff">${phone}</text>
  <text x="80" y="556" text-anchor="start" font-family="Vazirmatn Variable, Vazirmatn"
        font-size="28" font-weight="500" fill="#a7f3d0">${footnote}</text>
</svg>`
}

/** Renders the card to PNG bytes. */
export function renderOgCard(content, projectRoot) {
  const font = resolve(
    projectRoot,
    'node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2',
  )
  const latin = resolve(
    projectRoot,
    'node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-latin-wght-normal.woff2',
  )

  const resvg = new Resvg(card(content), {
    fitTo: { mode: 'width', value: WIDTH },
    font: {
      fontBuffers: [readFileSync(font), readFileSync(latin)],
      defaultFontFamily: 'Vazirmatn Variable',
      loadSystemFonts: false,
    },
  })

  return resvg.render().asPng()
}

export const OG_WIDTH = WIDTH
export const OG_HEIGHT = HEIGHT
