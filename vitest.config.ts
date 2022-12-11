import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
    silent: false,
    exclude: [
      '**/node_modules/**',
      '**/out/**',
      '**/dist/**',
    ]
  },
})
