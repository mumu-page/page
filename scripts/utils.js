import { getPackagesSync } from '@lerna/project'
import path from 'path'

export const isProduction = !process.env.ROLLUP_WATCH

export const getPackageDir = (name, dir = 'lib') => {
  return path.resolve(__dirname, path.join('../packages/', name, dir))
}

export const getOutFile = (name, dir = 'lib') => {
  return path.join(getPackageDir(name, dir), 'index.js')
}

export const getDtsFile = (name, dir = 'lib') => {
  return path.join(getPackageDir(name, dir), 'index.d.ts')
}

export const getClearDir = (name, dir = 'lib') => {
  return getPackageDir(name, dir)
}

export const getInputFile = (name, source) => {
  return path.resolve(
    __dirname,
    path.join('../packages/', name, source)
  )
}

export const packages = getPackagesSync()
