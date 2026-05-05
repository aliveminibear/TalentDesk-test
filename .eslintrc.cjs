module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/',
    'backend/uploads/',
    'dist/',
    'build/',
    'coverage/',
  ],
  overrides: [
    {
      files: ['backend/**/*.js', 'shared/**/*.js'],
      env: {
        node: true,
        browser: false,
      },
      extends: ['airbnb-base'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'import/extensions': ['error', 'ignorePackages'],
        'no-console': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.config.{js,cjs,mjs}',
              '**/*.test.js',
              '**/test/**',
              '**/tests/**',
              '**/__tests__/**',
            ],
          },
        ],
      },
    },
    {
      files: ['frontend/**/*.{js,jsx}'],
      env: {
        browser: true,
        node: false,
      },
      extends: ['airbnb', 'airbnb/hooks'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          alias: {
            map: [['@shared', './shared']],
            extensions: ['.js', '.jsx'],
          },
          node: {
            extensions: ['.js', '.jsx'],
          },
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
        'jsx-a11y/label-has-associated-control': [
          'error',
          { assert: 'either', depth: 25 },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          { js: 'always', jsx: 'always' },
        ],
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.config.{js,cjs,mjs}',
              '**/*.test.{js,jsx}',
              '**/test/**',
              '**/tests/**',
              '**/__tests__/**',
              '**/setupTests.{js,jsx}',
            ],
          },
        ],
      },
    },
    {
      files: ['frontend/vite.config.js'],
      env: { node: true, browser: false },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      files: ['*.cjs'],
      env: { node: true },
      parserOptions: { sourceType: 'script' },
    },
  ],
};
