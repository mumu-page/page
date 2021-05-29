/**
 * 更新store默认会进行合并操作，但有些值不需要合并
 * 将这些不需要合并的值先拿出来重置，后面就可以进行覆盖了
 * @param targetObj 要修改的对象
 * @param receive 接收的对象
 * @param keys 要修改的key
 * @param value 要修改的值
 * @returns
 */
export const formatValue = (
  keys: string[],
  value?: any,
  targetObj: any = {},
  receive: any = {}
) => {
  const comKeys = Object.keys(receive)
  keys.forEach((key) => {
    // 如果接收的对象中包含这个key，就先重置它
    if (comKeys.includes(key)) {
      Reflect.set(targetObj, key, value)
    }
  })
  return targetObj
}
