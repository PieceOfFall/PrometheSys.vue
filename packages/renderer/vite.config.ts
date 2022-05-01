import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

import resolve from 'vite-plugin-resolve'
import electron from 'vite-plugin-electron/renderer'
import Pages from 'vite-plugin-pages'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue(),
    electron(),

    Pages(),

    Components(),

    resolve(
      /**
       * Here you can specify other modules
       * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
       *    which will ensure that the electron-builder can package it correctly
       */
      {
        // If you use electron-store, this will work
        'electron-store': 'const Store = require("electron-store"); export default Store;',
      },
    ),
  ],
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
})
