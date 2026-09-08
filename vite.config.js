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

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: { input: pages },
  },
})
