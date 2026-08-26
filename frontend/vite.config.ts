import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** Vite configuration for the Agent Studio web shell. */
export default defineConfig({
  plugins: [vue()],
  server: { host: 'localhost', port: 5173 },
  preview: { host: 'localhost', port: 4173 },
})
