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
 * Two typefaces, and the split is not decorative. Fontsource ships Vazirmatn
 * as subset files that all declare the *same* family name, so a renderer
 * asked for "Vazirmatn" resolves to whichever it loaded first and Latin
 * characters come back out of the Arabic subset as garbage. Outfit carries a
 * family name of its own, so naming it explicitly on the Latin runs resolves
 * them to a font that actually has those letters — and it is a better
 * wordmark face than a text font set large.
 *
 * Rule for editing this file: Persian text names Vazirmatn, Latin text names
 * Outfit, and no run mixes the two scripts.
 *
 * Three things about the renderer were learned the hard way and are all load
 * bearing:
 *
 *   - `fontBuffers` does not exist in this version of resvg-js. Passing it is
 *     silently ignored, and every glyph then comes from a system font — which
 *     means the card looked right on a Windows machine and would have come
 *     out as something else entirely on the Linux runner that builds it.
 *     Fonts have to arrive as `fontFiles` paths.
 *   - resvg does not apply variable-font weight axes, so a variable file set
 *     to weight 800 renders at its default instance. The static per-weight
 *     files are used instead, one file per weight actually drawn.
 *   - Fontsource ships woff2, resvg wants a plain sfnt, so each file is
 *     decompressed once into node_modules/.cache and reused after that.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { decompress } from 'wawoff2'

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
const FA = 'Vazirmatn Variable'
const EN = 'Outfit'

function card({ wordmark, tagline, families, phone }) {
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

  ${mark(right - 104, 70, 104)}

  <!-- Wordmark. Latin, so it names Outfit — see the note at the top. -->
  <text x="${right}" y="292" text-anchor="end" font-family="${EN}"
        font-size="118" font-weight="800" letter-spacing="-2" fill="#ffffff">${wordmark}</text>

  <text x="${right}" y="356" text-anchor="end" font-family="${FA}"
        font-size="36" font-weight="500" fill="#d1fae5">${tagline}</text>

  <g font-family="${FA}" font-size="29" font-weight="600" fill="#ecfdf5">
    ${families
      .map((label, i) => {
        // Laid out right to left, the direction the rest of the site reads in.
        const w = label.length * 16.5 + 42
        const x =
          right - families.slice(0, i).reduce((sum, l) => sum + l.length * 16.5 + 42 + 13, 0) - w
        return `<g>
      <rect x="${x}" y="412" width="${w}" height="56" rx="17"
            fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.28)" stroke-width="1" />
      <text x="${x + w / 2}" y="449" text-anchor="middle">${label}</text>
    </g>`
      })
      .join('')}
  </g>

  <!-- Latin digits, so Outfit again. Loosened a little: this is the one thing
       on the card a reader may want to read off and dial. -->
  <text x="${right}" y="560" text-anchor="end" font-family="${EN}"
        font-size="40" font-weight="700" letter-spacing="2" fill="#ffffff">${phone}</text>
</svg>`
}


/**
 * Only the Arabic subset of Vazirmatn is loaded. Its Latin siblings declare
 * the same family name, so loading one of those as well would leave which
 * file answers to "Vazirmatn" down to load order — the bug this pairing
 * exists to avoid. Latin has its own family and its own files.
 *
 * One file per weight the card actually draws, and no more.
 */
const FACES = [
  // Persian comes from the variable file the site itself ships. Fontsource's
  // *static* Vazirmatn subsets decompress fine but resvg will not match them
  // by any name — they render as tofu — so the variable one it is.
  '@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2',
  // Latin has to be static: resvg ignores variable weight axes, so the
  // variable Outfit came out at its thin default instead of a wordmark.
  '@fontsource/outfit/files/outfit-latin-800-normal.woff2',
  '@fontsource/outfit/files/outfit-latin-700-normal.woff2',
]

/** woff2 in, a path to a plain sfnt out, decompressed once and cached. */
async function sfntPath(projectRoot, relative) {
  const cache = resolve(projectRoot, 'node_modules/.cache/nylonium-og-fonts')
  mkdirSync(cache, { recursive: true })

  const out = resolve(cache, relative.split('/').pop().replace(/\.woff2$/, '.ttf'))
  if (!existsSync(out)) {
    const woff2 = readFileSync(resolve(projectRoot, 'node_modules', relative))
    writeFileSync(out, Buffer.from(await decompress(woff2)))
  }
  return out
}


export async function renderOgCard(content, projectRoot) {
  // One at a time, deliberately. wawoff2 is a WebAssembly build around a
  // single shared heap, so decompressing in parallel interleaves the writes
  // and every file comes back corrupt — same byte length, wrong bytes, and a
  // renderer that silently falls back to tofu rather than complaining.
  const fontFiles = []
  for (const face of FACES) {
    fontFiles.push(await sfntPath(projectRoot, face))
  }

  const resvg = new Resvg(card(content), {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles, defaultFontFamily: FA, loadSystemFonts: false },
  })

  return resvg.render().asPng()
}

export const OG_WIDTH = WIDTH
export const OG_HEIGHT = HEIGHT
