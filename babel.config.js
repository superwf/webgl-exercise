const path = require('path')
const reduce = require('lodash/reduce')
const tsconfig = require('./tsconfig.json')

const pathAlias = reduce(
  tsconfig.compilerOptions.paths,
  (r, v, k) => {
    // r.push([k.replace('/*', ''), v[0].replace('/*', '')])
    return {
      ...r,
      [k.replace('/*', '')]: path.join(__dirname, v[0].replace('/*', '')),
    }
  },
  {},
)

const config = {
  presets: ['react-app'],
  plugins: [
    [
      'module-resolver',
      {
        alias: pathAlias,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs'],
      },
    ],
  ],
}
module.exports = config
