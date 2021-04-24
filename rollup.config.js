import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
// import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/App.tsx',
    output: [
      {
        file: 'dist/index.js',
        // 编译目标，es module
        format: 'umd',
        sourcemap: false,
        name: 'ReactVisualEditor',
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
      production && terser(),
    ],
    // 第三方模块不会强行打包到输出中
    external: (id) =>
      /^(react|antd|@ant-design\/icons)|@babel\/standalone/.test(id),
  },
  // 打包声明文件
  //   {
  //     input: 'src/App.tsx',
  //     output: [{ file: 'dist/index.d.ts', format: 'umd' }],
  //     plugins: [dts()],
  //   },
]
