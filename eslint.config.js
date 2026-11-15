import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// O token só pode ser lido e gravado pelo src/api/tokenStore.ts, que vai
// trocar o sessionStorage por cookie httpOnly antes de produção. Qualquer
// outro acesso ao storage do navegador é erro de lint.
const STORAGE_MESSAGE =
  'Use o src/api/tokenStore.ts: só ele acessa o storage do navegador.';
const STORAGE_NAMES = ['sessionStorage', 'localStorage'];
const STORAGE_OWNERS = ['window', 'globalThis', 'self'];

const restrictStorage = {
  rules: {
    'no-restricted-globals': [
      'error',
      ...STORAGE_NAMES.map((name) => ({ name, message: STORAGE_MESSAGE })),
    ],
    'no-restricted-properties': [
      'error',
      ...STORAGE_OWNERS.flatMap((object) =>
        STORAGE_NAMES.map((property) => ({
          object,
          property,
          message: STORAGE_MESSAGE,
        })),
      ),
    ],
  },
};

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'src/api/schema.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  { files: ['**/*.{ts,tsx,js,mjs}'], ...restrictStorage },
  {
    files: ['src/api/tokenStore.ts'],
    rules: {
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
    },
  },
]);
