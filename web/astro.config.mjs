import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Pure static site generation. Astro emits a static `dist/` that Cloudflare
// Pages serves directly — no adapter needed until a route requires SSR.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'http://localhost:4321',
  vite: {
    plugins: [tailwindcss()],
  },
})
