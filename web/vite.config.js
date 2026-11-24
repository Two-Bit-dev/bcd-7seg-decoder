import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base = repo name, so assets resolve on GitHub Pages
export default defineConfig({
  base: '/bcd-7seg-decoder/',
  plugins: [react()],
})
