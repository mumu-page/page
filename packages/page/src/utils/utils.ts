import { PoolItem } from '@r-generator/stores'
import { Target_ClassName } from '../constants/constants'

// 重新设置画布大小
export function resetViewport() {
  // 左侧按钮栏50 左侧面板250 Y抽标尺60 右侧面板300 右侧按钮栏50 X/Y轴滚动条14
  const isLeftSide = document.querySelector('.left-sidebar')
  const isRightSide = document.querySelector('.right-sidebar')
  const rWidth =
    50 + (isLeftSide ? 250 : 0) + 60 + (isRightSide ? 300 : 0) + 50 + 14
  const rHeight = 60 + 14
  const el = document.querySelector('.viewport') as HTMLElement
  if (!el) return
  el.style.width = (window.innerWidth - rWidth) * 0.95 + 'px'
  el.style.height = (window.innerHeight - rHeight) * 0.95 + 'px'
}

export function isChildren(componentKey: string) {
  return ['Upload'].includes(componentKey)
}

export function isSelect(componentKey: string) {
  return [
    'Select',
    'Cascader',
    'TimePicker',
    'TimePicker.RangePicker',
    'DatePicker',
    'DatePicker.RangePicker',
  ].includes(componentKey)
}

export function hasNotPlaceholder(componentKey: string) {
  return [
    'Radio',
    'Checkbox',
    'Switch',
    'Slider',
    'Rate',
    'Upload',
    'Row',
    'Button',
  ].includes(componentKey)
}

export function isDateComponent(type: string) {
  return [
    'time-picker',
    'time-picker/range-picker',
    'date-picker',
    'date-picker/range-picker',
    'cascader',
  ].includes(type)
}

export function isRenderFormItem(componentKey: string) {
  return !['Col', 'Button', 'List1'].includes(componentKey)
}

export function isColComponent(componentKey: string) {
  return ['Col'].includes(componentKey)
}

export function isDatePickerRange(componentKey: string) {
  return ['TimePicker.RangePicker', 'DatePicker.RangePicker'].includes(
    componentKey
  )
}

async function loadScript(scriptSrc: string) {
  const dfd = {} as {
    promise: Promise<any>
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  if ((window as any)[scriptSrc]) {
    // console.log((window as any)[scriptSrc])
    dfd.resolve(null)
    return dfd.promise
  }
  const head = document.head || document.getElementsByTagName('head')[0]
  const script = document.createElement('script') as HTMLScriptElement
  script.type = 'text/javascript'
  script.async = true // 异步脚本，立即下载，立即执行。如果不设置就延迟到整个页面都解析完毕后再运行
  script.onerror = dfd.reject
  script.onload = function (this: any, ev) {
    console.log('加载成功: ' + scriptSrc)
    ;(window as any)[scriptSrc] = 'success'
    dfd.resolve(null)
    // Handle memory leak in IE
    script.onload = null
  }
  script.src = scriptSrc
  head.appendChild(script)
  return dfd.promise
}

export function isCheck(componentKey: string) {
  return ['Radio', 'Checkbox', 'Switch'].includes(componentKey)
}

/**
 * 解析key为['aa.bb']的对象
 * @param target
 * @param keys
 * @param result
 */
export function decodeKey(
  target: Record<string, any>,
  keys: string[],
  result = {} as any
) {
  keys.forEach((key) => {
    result[key] = {}
  })
  try {
    Object.keys(target).forEach((key) => {
      const [parentKey, childKey] = key?.split('.')
      const val = target[key]
      result[parentKey][childKey] = val
    })
  } finally {
    return result
  }
}

/**
 * 将对象转为key为[aa.bb]的对象
 * @param target1
 * @param target2
 * @param result
 */
export function encodeKey(
  target1: {
    key: string
    data: Record<string, any>
  },
  target2: {
    key: string
    data: Record<string, any>
  },
  result = {} as any
) {
  try {
    Object.keys(target1.data).forEach((key) => {
      result[`${target1.key}.${key}`] = target1.data[key]
    })
    Object.keys(target2.data).forEach((key) => {
      result[`${target2.key}.${key}`] = target2.data[key]
    })
  } finally {
    return result
  }
}

/**
 * 获取辅助线元素列表elementGuidelines 当前位置frame 当前元素target
 * @param id
 * @param selectors
 * @param list
 */
export function findTarget(
  id: string | number | undefined,
  list: PoolItem[],
  selectors = `.${Target_ClassName}`
) {
  let elementGuidelines = [].slice.call(
    document.querySelectorAll(selectors) as any
  )
  const target = elementGuidelines.filter((item: any) => {
    return item?.getAttribute?.('data-id') === id
  })?.[0]
  const frame = list?.filter((item) => {
    return item.id === id
  })?.[0]?.layout?.frame

  // 将当前元素从divList中移除, 当前元素不再作为参考辅助线
  elementGuidelines = elementGuidelines.filter((item: any) => {
    return item?.getAttribute?.('data-id') !== id
  })

  return {
    elementGuidelines,
    target,
    frame,
  }
}

export function shortid(length: number = 5) {
  return Number(
    Math.random().toString().substr(3, length) + Date.now()
  ).toString(36)
}
