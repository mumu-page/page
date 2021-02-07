import { isEqual } from 'lodash'

export function areEqualIndex(prevProps: any, nextProps: any) {
  return isEqual(prevProps, nextProps);
}

export function areEqualItem(prevProps: any, nextProps: any) {
  return isEqual(prevProps, nextProps);
}
