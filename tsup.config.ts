import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],   
  dts: true,
  target: 'es2020',
  splitting: false,
  sourcemap: true,
  treeshake: true,
  clean: true,
  outDir: 'dist',

  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
});