import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Cache-bust: Force Vercel rebuild to clear any old WebSocket references
export default defineConfig({
  plugins: [react()],
})
