export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    // format: 'iife',
    format: 'umd',
    globals: {
      'apollo-link': 'apollo-link'
    },
    name: `apolloMockLink`,
    sourcemap: true,
    exports: 'named',
  },
  external: ['apollo-link']
};