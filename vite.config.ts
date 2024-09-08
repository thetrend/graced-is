/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import macrosPlugin from 'vite-plugin-babel-macros'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve'

  return {
    plugins: [react(), mkcert(), macrosPlugin()],
    define: {
      'process.platform': JSON.stringify('win32'),
      'process.env': {},
    },
    server: {
      proxy: isDevelopment
        ? {
            '/api': 'http://localhost:8888', // Proxy requests to your backend during development
          }
        : undefined, // No proxy in production
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './src/tests/setup.ts',
    },
  }
})
