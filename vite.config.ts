import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: el build funciona igual en la raíz de un dominio o dentro de una subcarpeta
export default defineConfig({
  base: './',
  plugins: [react()],
})
