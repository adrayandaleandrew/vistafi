import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
      'tests/integration/**/*.test.tsx',
    ],
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@shared': resolve(__dirname, './shared') },
  },
})
