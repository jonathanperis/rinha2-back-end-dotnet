export default [
  {
    ignores: ['out/**', 'node_modules/**', '.astro/**'],
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
