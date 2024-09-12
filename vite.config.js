import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/lib/gw.js'),
      /** exported global object: */
      name: 'GW',
      fileName: (format) => `gw.${format}.js`,
    },
  },
});
