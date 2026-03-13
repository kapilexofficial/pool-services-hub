import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: true,
    hmr: false, // Disable HMR in production
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
  },
})
