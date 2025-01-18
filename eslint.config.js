import plugin from 'eslint-plugin-mist3rbru'

export default [
  plugin.configs.react,
  plugin.configs.jest,
  {
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'react/jsx-no-bind': 'off',
    },
  },
  {
    files: ['**/index.ts'],
    rules: {
      '@stylistic/padding-line-between-statements': 'off',
    },
  },
]
