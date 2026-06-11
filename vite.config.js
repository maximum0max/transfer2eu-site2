import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// transfer2eu-site — static marketing site, React + Vite.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8765,
    open: true,
  },
})
