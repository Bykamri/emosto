import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Semua permintaan ke /api diteruskan ke backend FastAPI (awalan /api dibuang),
// jadi di dev tidak perlu mengurus CORS.
const backend = 'http://localhost:8000'
const proxy = {
  '/api': {
    target: backend,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
