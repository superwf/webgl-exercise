const reduce = require('lodash/reduce')
const path = require('path')

const tsconfig = require('./tsconfig.json')

// 处理tsconfig的路径别名
const pathAlias = reduce(
  tsconfig.compilerOptions.paths,
  (r, v, k) => {
    r.push([k.replace('/*', ''), path.resolve(__dirname, v[0].replace('/*', ''))])
    return r
  },
  [],
)

const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['import', 'prettier', 'react-hooks'],
  extends: [
    'prettier',
    'prettier/react',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true,
        stylelintIntegration: true,
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        jsxBracketSameLine: false,
        endOfLine: 'lf',
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: pathAlias,
        extensions: ['.ts', '.js', '.jsx', '.json', '.tsx'],
      },
    },
  },
}

module.exports = config
