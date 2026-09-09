import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://iconiccerberrus.github.io/Nylonium/, so assets need the
// repository name as their base path. Local dev still runs at the root.
const base = process.env.GITHUB_ACTIONS ? '/Nylonium/' : '/'

// Every .html at the project root plus every generated variant page under
// product/. Discovering them means adding a product never requires editing
// this file — `npm run gen` writes the shell and the build picks it up.
const htmlIn = (dir, prefix = '') => {
  let files = []
  try {
    files = readdirSync(resolve(import.meta.dirname, dir))
  } catch {
    return [] // product/ does not exist until the generator has run
  }
  return files
    .filter((f) => f.endsWith('.html'))
    .map((f) => [prefix + f.replace(/\.html$/, ''), resolve(import.meta.dirname, dir, f)])
}

const pages = Object.fromEntries([...htmlIn('.'), ...htmlIn('product', 'product/')])

/**
 * Preloads the Arabic subset of the body font.
 *
 * Without it the font is not requested until the stylesheet has been fetched
 * and parsed, which puts a whole round trip in front of the text every page
 * renders with. The filename is content-hashed, so it has to be read from the
 * bundle rather than written into the shells by hand.
 */
function preloadBodyFont() {
  let href = null

  return {
    name: 'preload-body-font',
    enforce: 'post',
    apply: 'build',

    transformIndexHtml(html, ctx) {
      if (!href && ctx.bundle) {
        // `base` is absolute, so one href is correct from the project root
        // and from product/ alike — no relative walking needed.
        href = Object.keys(ctx.bundle).find(
          (f) => f.includes('vazirmatn-arabic') && f.endsWith('.woff2'),
        )
      }
      if (!href) return html

      return {
        html,
        tags: [
          {
            tag: 'link',
            injectTo: 'head-prepend',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: base + href,
              crossorigin: '',
            },
          },
        ],
      }
    },
  }
}

/**
 * Preloads the product catalogue a page is about to ask for.
 *
 * `entries/product.jsx` decides which family to import from `data-page` on
 * `<html>`, which the browser cannot know until it has downloaded and parsed
 * the entry — so the catalogue request only started after that, one round
 * trip late, with nothing else in flight. On a phone that is most of a fifth
 * of a second of waiting before the page can finish.
 *
 * A `modulepreload` in the shell tells the browser about the file up front,
 * so it travels alongside the entry instead of behind it. The filename is
 * content-hashed, so it has to be read out of the bundle rather than written
 * into the shells by hand.
 */
function preloadFamilyChunk() {
  return {
    name: 'preload-family-chunk',
    enforce: 'post',
    apply: 'build',

    transformIndexHtml(html, ctx) {
      const family = html.match(/data-page="([^"]+)"/)?.[1]
      if (!family || !ctx.bundle) return html

      // Matched on the module this chunk was built from, not on its filename.
      // Chunk names are not unique enough to match by hand: every family's
      // catalogue produces a chunk called after the family, and a filename
      // regex happily picked the wrong one — injecting a preload for a file
      // that did not exist, which is a 404 on every product page.
      const source = `/src/data/families/${family}.js`
      const chunk = Object.values(ctx.bundle).find(
        (c) => c.type === 'chunk' && c.facadeModuleId?.replace(/\\/g, '/').endsWith(source),
      )
      if (!chunk) return html
      const file = chunk.fileName

      return {
        html,
        tags: [
          {
            tag: 'link',
            injectTo: 'head',
            attrs: { rel: 'modulepreload', crossorigin: '', href: base + file },
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), preloadBodyFont(), preloadFamilyChunk()],
  build: {
    rollupOptions: { input: pages },
  },
})
