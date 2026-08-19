import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://iconiccerberrus.github.io/Nylonium/, so assets need the
// repository name as their base path. Local dev still runs at the root.
const base = process.env.GITHUB_ACTIONS ? '/Nylonium/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
