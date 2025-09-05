import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    proxy:{
      'api' : 'http://localhost:8001'
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    tailwindcss(),
  ],
})