import * as Icons from '@ant-design/icons'

function getICONS() {
  const result: { [key: string]: any } = {}
  Object.entries(Icons)
    .filter((option) => {
      const [iconKey] = (option || []) as any
      return ![
        'IconProvider',
        'default',
        'setTwoToneColor',
        'getTwoToneColor',
        'createFromIconfontCN',
      ].includes(iconKey)
    })
    .forEach((option) => {
      const [iconKey, Icon] = (option || []) as any
      result[iconKey] = Icon
    })
  return result
}

export const LOCAL_STORE_KEY = 'STORE'

export const PLACEHOLDER_ENUM: { [key: string]: string[] } = {
  'TimePicker.RangePicker': ['开始时间', '结束时间'],
  'DatePicker.RangePicker': ['开始日期', '结束日期'],
}

export const ICON_ENTRIES = Object.entries(Icons).filter((option) => {
  const [iconKey] = (option || []) as any
  return ![
    'IconProvider',
    'default',
    'setTwoToneColor',
    'getTwoToneColor',
    'createFromIconfontCN',
  ].includes(iconKey)
})

export const ICONS = getICONS()

// 可拖拽元素的类名
export const Target_ClassName = 'drag-target'
