import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve'

  return {
    plugins: [react(), macrosPlugin()],
    define: {
      'process.platform': JSON.stringify('win32'),
      'process.env': {},
    },
    server: {
      proxy: isDevelopment
        ? {
            '/api': 'http://localhost:8888',
          }
        : undefined,
    },
  }
})
