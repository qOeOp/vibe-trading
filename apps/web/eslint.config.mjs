import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // Downgrade noisy pre-existing errors to warnings
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      // Re-apply after flat/react which overrides root config options
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // ngx-charts library: BaseChart render-prop pattern calls hooks inside callbacks
  {
    files: ['**/lib/ngx-charts/**/*.ts', '**/lib/ngx-charts/**/*.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'warn',
      'import/first': 'warn',
      'prefer-spread': 'warn',
    },
  },
  // Vendored marimo editor: internal imports use deep relative paths and
  // worker files use `self` global. These are upstream patterns we preserve.
  {
    files: [
      '**/features/lab/components/data-table/**',
      '**/features/lab/components/editor/**',
      '**/features/lab/core/**',
      '**/features/lab/plugins/**',
      '**/features/lab/hooks/**',
      '**/features/lab/utils/**',
      '**/features/lab/theme/**',
    ],
    rules: {
      'no-restricted-imports': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/public/pyodide-worker.js'],
    rules: {
      'no-restricted-globals': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
