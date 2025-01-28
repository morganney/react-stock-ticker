/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/stockTicker.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src'],
      reporter: ['text', 'text-summary', 'clover', 'json', 'lcov'],
    },
  },
})
