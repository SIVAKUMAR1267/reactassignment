import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
          plugins: [react()],
          server: {
            port: 10000, // Port for development server
          },
          preview: {
            port: 8080, // Port for serving the production build
          }
        })