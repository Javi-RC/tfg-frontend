import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '__mocks__', '**/*_backup.jsx']),
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['**/*.test.{js,jsx}', '**/*.test.js', '**/*.test.jsx'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    ...prettier,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/test-utils.jsx', 'src/**/test-utils.jsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['vite.config.js', 'jest.config.cjs', 'babel.config.cjs', 'jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/contexts/*.jsx', 'src/components/**/QuestionnaireContext.jsx', 'src/components/**/*Card.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
