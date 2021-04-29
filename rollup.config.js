import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import { babel } from '@rollup/plugin-babel'
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
// import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/visual-editor.tsx',
    output: [
      {
        file: 'dist/visual-editor.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/visual-editor.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      //   peerDepsExternal({
      //     packageJsonPath: 'package.json',
      //   }),
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      //   babel({
      //     exclude: '**/node_modules/**',
      //   }),
      json(),
      postcss({
        extract: 'index.css',
        plugins: [],
      }),
      typescript(),
      //   production && terser(),
    ],
    external: (id) => {
      const external = [
        'antd',
        'lodash',
        'moment',
        '@ant-design/icons',
        'react',
        'react-dom',
        'react-draggable',
        'react-infinite-viewer',
        'react-moveable',
        'react-split-pane',
        'immer',
        '@monaco-editor/react',
        '@scena/react-guides',
      ]
      return external.includes(id) || /^(react|rc|antd)/.test(id)
    },
  },
  // 打包声明文件
  {
    input: 'src/index.d.tsx',
    output: [{ file: 'dist/index.d.ts', format: 'umd' }],
    plugins: [dts()],
  },
]
