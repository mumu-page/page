import { shortid } from '@r-generator/shared'
import { PUT_COMPONENT_LIST } from '@r-generator/stores'
import { cloneDeep } from 'lodash'
import { PoolItem } from '../../constants'

export const addComponent = (
  childItem: PoolItem,
  setGlobal: (...arg: any) => void
) => {
  let id, key
  id = key = shortid()
  const _childItem = cloneDeep(childItem)
  _childItem.id = id
  _childItem.key = id
  setGlobal({
    type: PUT_COMPONENT_LIST,
    payload: _childItem,
  })
}
