import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/renderer/main'),
      'setting@': path.join(__dirname, 'src/renderer/setting')
    },
    extensions: [".ts", ".tsx", '.js', '.vue', '.json', '.css']
  },
  optimizeDeps: {
    exclude: ['electron'],
  },
  build: {
    rollupOptions: {
      external: ['electron'],
      input: {
        'index': './index.html',
        'setting': './setting.html'
      },
      output: {
        dir: './dist',
      }
    }
  }
})
