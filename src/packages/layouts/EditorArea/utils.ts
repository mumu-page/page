import { isEqual } from 'lodash'

export function areEqualList(prevProps: any, nextProps: any) {
  return isEqual(prevProps, nextProps);
}

export function areEqualItem(prevProps: any, nextProps: any) {
  return isEqual(prevProps, nextProps);
}
