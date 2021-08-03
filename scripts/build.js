import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import { getInputFile, getOutFile, isProduction, inputs } from './utils'

export default inputs.map((pkg) => {
  const peerDependencies = pkg.peerDependencies || {}
  const name = pkg.name.replace('@r-generator/', '')
  return {
    input: getInputFile(name, pkg.get('source')),
    output: [
      {
        format: 'es',
        file: getOutFile(name, 'es'),
        sourcemap: false,
      },
      {
        format: 'cjs',
        file: getOutFile(name, 'lib'),
        exports: 'named',
        sourcemap: false,
      },
      {
        file: getOutFile(name, 'dist'),
        format: 'umd',
        sourcemap: false,
        name: name,
        globals: {
          immer: 'immer',
          lodash: 'lodash',
          react: 'React',
        },
      },
    ],
    plugins: [
      typescript(),
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
        exclude: '**/node_modules/**',
      }),
      json(),
      postcss({
        extract: 'index.css',
      }),
      isProduction && terser(),
    ],
    external: (id) => {
      const external = Object.keys(peerDependencies)
      return (
        external.includes(id) ||
        /^(react|rc|moment|monaco|@ant-design)/.test(id)
      )
    },
  }
})
