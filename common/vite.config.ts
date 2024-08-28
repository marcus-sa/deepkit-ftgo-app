import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { deepkitType } from '@deepkit/vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../node_modules/.vite/common',

  plugins: [
    deepkitType({
      compilerOptions: {
        sourceMap: true,
      },
    }),
    nxViteTsPaths(),
  ],

  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/common',
      provider: 'v8',
    },
  },
});
