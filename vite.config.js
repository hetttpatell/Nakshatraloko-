import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5173',  // fix: add / before api
    },
    hmr: {
      overlay: false,
    },
    allowedHosts: ['nakshatraloka.com'], // 👈 allow your domain
    host: '0.0.0.0', // 👈 optional: listen on all addresses
  },
  plugins: [
    tailwindcss(),
  ],
})
