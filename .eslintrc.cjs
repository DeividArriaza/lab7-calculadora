module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['dist', 'coverage', 'storybook-static'],
  rules: {
    'no-semicolons': 'error',
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  }
}
