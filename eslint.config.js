import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        GW: 'readonly',
      },
    },
  },
  js.configs.recommended,
  {
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
];
