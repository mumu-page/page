interface IParams {
  childKeys: string[]
  targetObj: any
  newValue?: any
  value?: any
  parentKey: string
}

/**
 * 更新store默认会进行合并操作，但有些值不需要合并
 * 将这些不需要合并的值先拿出来重置，后面就可以进行覆盖了
 * @param params.targetObj 要修改的对象
 * @param params.newValue 接收的对象
 * @param params.keys 要修改的key
 * @param params.value 要修改的值
 * @param params.parentKey 对象父级属性
 * @returns
 */
export const coverValue = (params: IParams) => {
  const { targetObj, childKeys, value, parentKey } = params
  childKeys.forEach((key) => {
    // 如果接收的对象中包含这个key，就先重置它
    if (targetObj?.[parentKey]?.[key]) {
      targetObj[parentKey][key] = value
    }
  })
}
