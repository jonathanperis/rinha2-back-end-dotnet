import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['out/**', 'node_modules/**', '.astro/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
      },
    },
  },
];
