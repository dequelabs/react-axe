module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 'off'
  },
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  }
};
