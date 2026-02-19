import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      // Externalize Angular and RxJS to let the browser resolve them via the importmap
      external: [
        /^@angular\/.*/,
        /^rxjs(\/.*)?$/
      ]
    }
  }
});