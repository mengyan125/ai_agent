import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/** Vitest configuration for Vue component and router tests. */
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
  },
})
