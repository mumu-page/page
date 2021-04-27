import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/visual-editor.tsx',
    output: [
      {
        file: 'dist/index.js',
        // 编译目标，es module
        format: 'umd',
        sourcemap: false,
        name: 'ReactVisualEditor',
        // https://unpkg.com/@babel/standalone@7.13.17/babel.min.js
      },
    ],
    plugins: [
      // 支持第三方模块
      resolve({
        preferBuiltins: false,
      }),
      // 支持 commonjs 格式
      commonjs(),
      babel({
        exclude: '**/node_modules/**',
      }),
      json(),
      postcss({
        extract: true, // extracts to `${basename(dest)}.css`
        plugins: [],
      }),
      typescript(),
      peerDepsExternal({
        packageJsonPath: 'package.json'
      }),
      production && terser(),
    ],
  },
  // 打包声明文件
  {
    input: 'src/index.d.tsx',
    output: [{ file: 'dist/index.d.ts', format: 'umd' }],
    plugins: [dts()],
  },
]
