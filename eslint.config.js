import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'coverage', 'node_modules', 'public/theme-init.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      // Confidentialité (§15.2) : aucun appel réseau applicatif.
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Aucune requête réseau applicative (local-first, §15).' },
        { name: 'XMLHttpRequest', message: 'Aucune requête réseau applicative (local-first, §15).' },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/tests/**'],
    rules: { 'no-restricted-globals': 'off' },
  },
);
