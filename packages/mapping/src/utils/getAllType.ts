import { PoolItem } from '@r-generator/stores'

export default function getAllType(
  componentList: PoolItem[],
  types = new Set()
) {
  componentList.forEach((item) => {
    types.add(item.type)
    item.children && getAllType(item.children, types)
  })
  return types
}
