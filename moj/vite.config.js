import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '/assets': path.resolve(__dirname, './node_modules/govuk-frontend/govuk/assets')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This is needed for GOV.UK Frontend
        includePaths: ['node_modules']
      }
    }
  }
})