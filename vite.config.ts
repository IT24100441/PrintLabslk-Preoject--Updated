import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy logo files from brain directory if they exist
const srcLogo = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\9d50808d-bd57-476b-a98b-22e3ed68c4be\\media__1781638256273.jpg'
const srcLogoText = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain\\9d50808d-bd57-476b-a98b-22e3ed68c4be\\media__1781638256274.jpg'
const destDir = path.resolve(__dirname, 'public/images')

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  if (fs.existsSync(srcLogo)) {
    fs.copyFileSync(srcLogo, path.join(destDir, 'logo.jpg'))
    console.log('Successfully copied logo.jpg')
  }
  if (fs.existsSync(srcLogoText)) {
    fs.copyFileSync(srcLogoText, path.join(destDir, 'logo_text.jpg'))
    console.log('Successfully copied logo_text.jpg')
  }
} catch (err) {
  console.error('Failed to copy logo images in vite.config.ts:', err)
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'ES2020',
    outDir: 'dist',
    minify: 'terser',
  },
})
