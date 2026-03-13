import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: process.env.NODE_ENV === 'production' ? [] : [react()],
  server: { hmr: false },
  build: { outDir: 'dist', minify: 'terser' },
})
