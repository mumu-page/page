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
  return path.resolve(__dirname, path.join('../packages/', name, source))
}

const getOrder = (pkg) => {
  const order = pkg.get('order')
  return isNaN(order) ? 100 : order
}

export const packages = getPackagesSync().sort((a, b) => {
  return getOrder(a) - getOrder(b)
})

export const devPackages = packages.filter(
  (pkg) => !['@r-generator/page'].includes(pkg.name)
)

export const inputs = isProduction ? packages : devPackages
