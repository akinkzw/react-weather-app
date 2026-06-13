import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gsi': {
        target: 'https://msearch.gsi.go.jp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gsi/, '/address-search/AddressSearch'),
      },
    },
  },
})
