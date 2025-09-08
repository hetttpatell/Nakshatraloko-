import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    proxy:{
      'api' : 'http://localhost:5173'
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    tailwindcss(),
  ],
})