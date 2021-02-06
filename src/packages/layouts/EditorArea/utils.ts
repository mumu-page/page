import { isEqual } from 'lodash'

export function areEqualIndex(prevProps: any, nextProps: any) {
  if (isEqual(prevProps, nextProps)) {
    return true
  }

  return false
}

export function areEqualItem(prevProps: any, nextProps: any) {
  if (isEqual(prevProps, nextProps)) {
    return true
  }
  return false
}
