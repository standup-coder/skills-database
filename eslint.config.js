import tsparser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-this-alias': 'error',
      'import/order': ['warn', { 'alphabetize': { 'order': 'asc' }, 'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'] }]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js', '**/*.d.ts', 'docs/**', 'webui/**', 'scripts/**']
  }
];