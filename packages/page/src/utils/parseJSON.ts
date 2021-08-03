import { IFormComProp } from '@r-generator/stores'

interface IIPropertiesItem {
  type: string
  widget: string
  format?: string
}
interface IProperties {
  [key: string]: IIPropertiesItem
}

/**
 * 主要为了兼容json国际规范，将设计后的表单转换为JSON，以适配form-render
 * @param params
 */
export function parseJSON(list: IFormComProp[], target: IFormComProp) {
  let number = target.rowProps?.colNum // 展示几列
  let json = {
    type: 'object',
    properties: {} as IProperties,
  }
  list.forEach((item) => {
    const key = item.formItemProps.name
    const widget = item.componentKey.toLowerCase().replace(/^.*\./, '')
    json.properties[key] = {
      type: 'string',
      widget,
    }
  })

  return {
    number,
    json,
  }
}
