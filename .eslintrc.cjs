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
        // Native Node ESM requires explicit file extensions in imports.
        'import/extensions': ['error', 'ignorePackages'],
        // Backend logging is acceptable.
        'no-console': 'off',
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
        // Modern React/Vite projects don't need React in scope or PropTypes
        // (and we're not using TypeScript here).
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        // react-dropzone returns prop bundles via getRootProps/getInputProps
        // that are designed to be spread onto elements.
        'react/jsx-props-no-spreading': 'off',
        // Allow arrow-function components, which is the project's style.
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
        // <label htmlFor="..."> is HTML-valid on its own; allow either the
        // wrapping form or the htmlFor form.
        'jsx-a11y/label-has-associated-control': [
          'error',
          { assert: 'either', depth: 25 },
        ],
        // Native ESM in the browser via Vite needs explicit .js/.jsx extensions
        // for relative imports to keep parity with the backend.
        'import/extensions': [
          'error',
          'ignorePackages',
          { js: 'always', jsx: 'always' },
        ],
        // Vite's dev/test-only deps are pulled in as devDependencies; allow
        // them in config and test files.
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
