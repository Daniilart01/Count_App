import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: '/count_app/'
  },
  base: '/count_app/',
  plugins: [react()],
})
