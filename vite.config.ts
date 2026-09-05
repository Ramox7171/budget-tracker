import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ścieżki względne - wymagane, gdy aplikacja jest ładowana z tauri://
  // zamiast spod adresu serwera. Nie przeszkadza w wersji webowej.
  base: './',
})
