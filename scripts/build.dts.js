import dts from 'rollup-plugin-dts'
import { getInputFile, inputs, getDtsFile, getClearDir } from './utils'
import clear from 'rollup-plugin-clear'

export default inputs.map((pkg) => {
  const name = pkg.name.replace('@r-generator/', '')
  const input = getInputFile(
    name,
    name === 'page' ? 'src/index.d.tsx' : pkg.get('source')
  )
  return {
    input,
    output: [
      {
        format: 'es',
        file: getDtsFile(name, 'es'),
        sourcemap: false,
      },
      {
        format: 'cjs',
        file: getDtsFile(name, 'lib'),
        exports: 'named',
        sourcemap: false,
      },
      {
        file: getDtsFile(name, 'dist'),
        format: 'umd',
      },
    ],
    plugins: [
      clear({
        targets: [
          getClearDir(name, 'es'),
          getClearDir(name, 'lib'),
          getClearDir(name, 'dist'),
        ],
      }),
      dts(),
    ],
  }
})
