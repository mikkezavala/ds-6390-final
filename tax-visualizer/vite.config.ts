import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
      react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [{
        src: ['src/assets/*.json', 'src/assets/*.tsv'], dest: 'assets'
      }]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})