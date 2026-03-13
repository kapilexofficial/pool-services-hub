import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ fastRefresh: false })],
  server: { middlewareMode: false, hmr: false },
  build: { outDir: 'dist', minify: 'terser', sourcemap: false },
})
