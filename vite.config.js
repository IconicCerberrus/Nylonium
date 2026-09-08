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

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), preloadBodyFont()],
  build: {
    rollupOptions: { input: pages },
  },
})
