import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://iconiccerberrus.github.io/Nylonium/, so assets need the
// repository name as their base path. Local dev still runs at the root.
const base = process.env.GITHUB_ACTIONS ? '/Nylonium/' : '/'

// Every .html at the project root is a page. Picking them up automatically
// means adding a family page never requires editing this file.
const pages = Object.fromEntries(
  readdirSync(import.meta.dirname)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), resolve(import.meta.dirname, f)]),
)

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: { input: pages },
  },
})
