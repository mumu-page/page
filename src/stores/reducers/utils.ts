/**
 * 更新store默认会进行合并操作，但有些值不需要合并
 * 将这些不需要合并的值先拿出来重置，后面就可以进行覆盖了
 */
export const formatValue = (obj: any, keys: string[], value?: any) => {
  const comKeys = Object.keys(obj)
  // 如果 options fields 存在，先清空，不合并
  keys.forEach((key) => {
    if (comKeys.includes(key)) {
      Reflect.set(obj, key, value)
    }
  })
  return obj
}
