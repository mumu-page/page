import { isNumber } from 'lodash'
import React from 'react'
import { ICONS } from '../constants'
import { IComponentKeys, IFormComProp } from '../stores/typings'

function parseProp(key: string, value: any, result = '') {
  if (!value) return ''
  if (typeof value === 'undefined') return ''
  if (value === '{}') return ''
  try {
    result = JSON.parse(value)
    if (result !== null && ['object', 'number'].includes(typeof result)) {
      result = ` ${key}={${value}}`
    } else if (typeof result === 'boolean') {
      if (result === true) {
        result = ` ${key}`
      } else {
        result = ` ${key}={${value}}`
      }
    } else if (typeof result === 'string') {
      if (value?.indexOf('<') !== -1) {
        result = ` ${key}={${value?.replace?.(/"/g, '')}}`
      } else {
        result = ` ${key}=${value}`
      }
    }
  } catch (e) {
    result = ''
  } finally {
    return result
  }
}

function generateProps(props: { [key: string]: any }, result = '') {
  Object.keys(props).forEach((key) => {
    const value = JSON.stringify(props[key])
    result += `${parseProp(key, value)}`
  })
  return result
}

export function getIcon(iconKey: string, node = false) {
  if (iconKey) {
    const IconComponent = ICONS[iconKey]
    if (IconComponent && node) {
      return IconComponent || React.Fragment
    }
    if (IconComponent && !node) {
      return `<${iconKey} />`
    }
  }
  return node ? React.Fragment : null
}

function generateComProps(
  componentProps: { [key: string]: any },
  componentKey: IComponentKeys,
  result = ''
) {
  const {
    defaultValue,
    prefix,
    suffix,
    ...componentOtherProps
  } = componentProps
  // 处理输入框前后置图标
  if (['Input'].includes(componentKey)) {
    componentOtherProps['prefix'] = getIcon(prefix)?.replace(/"/g, '')
    componentOtherProps['suffix'] = getIcon(suffix)?.replace(/"/g, '')
  }
  // 控件参数
  Object.keys(componentOtherProps).forEach((key) => {
    let value = JSON.stringify(componentOtherProps[key])
    result += `${parseProp(key, value)}`
  })
  return result
}

function createFormItem(
  item: IFormComProp,
  currentDragComponent: IFormComProp,
  index: number,
  componentList: IFormComProp[]
): string {
  const {
    formItemProps,
    componentProps,
    componentKey,
    colProps = {},
    layout = {},
  } = item
  const { rowProps = {}, formProps = {} } = currentDragComponent
  const { colNum, gutter, align, justify, wrap, ...otherGlobalProps } = rowProps
  const { labelCol: labelColG, wrapperCol: wrapperColG } = formProps
  const { labelCol, wrapperCol } = formItemProps
  const { colNum: _colNum, ...otherColProps } = colProps
  /**样式开始 */
  const { frame = { translate: [0, 0, 0] }, height, width } = layout
  const { translate } = frame
  const style = {} as any
  // 排除不需要添加transform的样式
  if (
    translate[0] !== rowProps.gutter &&
    translate[0] !== 0 &&
    translate[1] !== 0
  ) {
    let translateX = translate[0]
    if (rowProps.gutter > 0 && translate[0] !== 0) {
      translateX = translate[0] - rowProps.gutter
    }
    style.transform = `translate(${translateX}px, ${translate[1]}px)`
  }
  if (isNumber(width)) {
    style.width = `${width}px`
  }
  if (height) {
    style.height = `${height}px`
  }
  /**样式结束 */
  const colPropsStr = generateProps({ ...otherGlobalProps, ...otherColProps })
  const formItemPropsStr = generateProps({
    style,
    ...formItemProps,
    labelCol: {
      ...labelColG,
      ...labelCol,
    },
    wrapperCol: {
      ...wrapperColG,
      ...wrapperCol,
    },
  })
  const componentPropsStr = generateComProps(componentProps, componentKey)
  const componentName = componentKey?.replace(/^.*\./, '')
  return `<Col${colPropsStr}>
            <Form.Item${formItemPropsStr}>
              <${componentName}${componentPropsStr}></${componentName}>
            </Form.Item>
          </Col>${componentList.length - 1 === index ? '' : '\n'}`
}

function generate(
  componentList: IFormComProp[],
  currentDragComponent: IFormComProp
) {
  let ret = ''
  const initialValues = {} as any
  componentList.forEach((item, index) => {
    ret += createFormItem(item, currentDragComponent, index, componentList)
    if (item.componentProps?.defaultValue && item.formItemProps?.name) {
      initialValues[item.formItemProps.name] = item.componentProps?.defaultValue
    }
  })
  const { rowProps = {} } = currentDragComponent
  const { gutter, align, justify, wrap } = rowProps
  const rowPropsStr = generateProps({ gutter, align, justify, wrap })
  const initialValuesStr = Object.keys(initialValues).length
    ? ` initialValues={${JSON.stringify(initialValues)}}`
    : ''
  return `<Form${initialValuesStr}>
        <Row${rowPropsStr}>
          ${ret}
        </Row>
    </Form>`
}

/**
 * 寻找所有使用到的组件Key
 */
function getAllComponentKey(
  componentList: IFormComProp[],
  keys = [] as string[]
) {
  componentList?.forEach((item) => {
    keys.push(item.componentKey)
    if (item?.children) {
      getAllComponentKey(item?.children, keys)
    }
  })
  keys.push('Form')
  return keys
}

/**
 * 生成引用代码
 * TODO: 生成ICON引用代码
 */
function generateImport(componentList: IFormComProp[]) {
  const keys = getAllComponentKey(componentList, [])
  const childImport = {} as any
  const parentImport = Array.from(
    new Set(
      keys.map((item) => {
        const [parent, child] = item.split('.')

        if (child) {
          if (childImport[parent]) {
            childImport[parent].push(child)
          } else {
            childImport[parent] = [child]
          }
        }
        return parent
      })
    )
  )
  parentImport.push('Row')
  parentImport.push('Col')

  const importReact = `import React from "react"\n`
  const importAntd = `import {${[parentImport]}} from 'antd'\n`
  let importAntdChild = ''
  Object.keys(childImport).forEach((key) => {
    const item = childImport[key]
    if (item.length) {
      importAntdChild += `const {${item}} = ${key}\n`
    }
  })
  if (importAntdChild) {
    return importReact + importAntd + '\n' + importAntdChild
  }
  return importReact + importAntd
}

export { generate, generateImport }
