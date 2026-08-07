import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// transfer2eu-site — static marketing site, React + Vite.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8765,
    open: true,
  },
  build: {
    // Modern evergreen browsers (the site's audience) — no legacy-ES5 output.
    target: 'es2020',
    // Keep CSS per-entry (one stylesheet per page instead of one giant file).
    cssCodeSplit: true,
    // Inline tiny assets (under 4 KB) as data: URIs — fewer requests for icons.
    assetsInlineLimit: 4096,
    // The prerenderer emits a fully-rendered HTML shell per URL, so the browser
    // never needs the modulepreload polyfill (all modulepreloads are preloaded
    // by the HTML <link rel="modulepreload"> that Vite injects for modern UAs).
    modulePreload: { polyfill: false },
    // Our route-level chunks (see App.jsx React.lazy) are data-heavy; keep the
    // warning threshold honest instead of artificially low.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split the React runtime into its own vendor chunk: it changes rarely,
        // so CDN/edge caches keep serving it across deploys while app chunks
        // stay small. Also gives the browser one stable, parallel cache entry.
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
