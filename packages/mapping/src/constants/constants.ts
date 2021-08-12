import { SizeType } from 'antd/lib/config-provider/SizeContext'
import * as Icons from '@ant-design/icons'

export const FORM_PROPERTIES_OPTIONS: {
  size: SizeType
  labelAlign: 'left' | 'right' | undefined
  [key: string]: any
} = {
  size: 'small',
  labelAlign: 'left',
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
  colon: false,
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
