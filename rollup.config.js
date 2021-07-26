import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import clear from 'rollup-plugin-clear'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: pkg.source,
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: false,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
      },
    ],
    plugins: [
      clear({
        // required, point out which directories should be clear.
        targets: ['dist'],
        // optional, whether clear the directores when rollup recompile on --watch mode.
        watch: false, // default: false
      }),
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      postcss({
        extract: 'index.css',
        plugins: [],
      }),
      typescript(),
      production && terser(),
    ],
    external: (id) => {
      const external = Object.keys(pkg.peerDependencies)
      return external.includes(id) || /^(react|rc|antd)/.test(id)
    },
  },
  // 打包声明文件
  {
    input: 'src/index.d.tsx',
    output: [{ file: pkg.types, format: 'umd' }],
    plugins: [dts()],
  },
]
