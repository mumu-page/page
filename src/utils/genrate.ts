import * as React from 'react'
import { ICONS } from '../constants'
import { IComponentKeys, IFormComProp } from '../stores/typings'
import { isChildren } from './utils'

function parseProp(key: string, value: any, result = '') {
  if (!value) return ''
  if (typeof value === 'undefined') return ''
  if (['{}', 'null'].includes(value)) return ''
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
  }
  return result
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
  const { defaultValue, prefix, suffix, ...componentOtherProps } =
    componentProps
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
  target: IFormComProp,
  index: number,
  componentList: IFormComProp[],
  colGlobalVariable: string,
  formItemGlobalVariable: string
): string {
  const {
    formItemProps,
    componentProps,
    componentKey,
    colProps = {},
    // layout = {},
  } = item
  const { labelCol, wrapperCol } = formItemProps
  const { colNum: _colNum, ...otherColProps } = colProps
  const colPropsStr = generateProps({ ...otherColProps })
  const formItemPropsStr = generateProps({
    // style,
    ...formItemProps,
    labelCol,
    wrapperCol,
  })
  const componentPropsStr = generateComProps(componentProps, componentKey)
  let componentName = ''
  // 可能会设计多个List1 用一个唯一标识区分他们
  if (item.componentKey === 'List1') {
    componentName = `${item.componentKey}${String(item.id).slice(0, 4)}`
  } else {
    componentName = componentKey?.replace(/^.*\./, '')
  }
  // TODO render children
  const Component = isChildren(componentKey)
    ? `<${componentName}${componentPropsStr}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </${componentName}>`
    : `<${componentName}${componentPropsStr} />`
  return `<Col {...${colGlobalVariable}}${colPropsStr}>
            <Form.Item {...${formItemGlobalVariable}}${formItemPropsStr}>
              ${Component}
            </Form.Item>
          </Col>${componentList.length - 1 === index ? '' : '\n'}`
}

function generate(componentList: IFormComProp[], target: IFormComProp) {
  const { rowProps = {}, formProps = {} } = target
  const { colNum, gutter, align, justify, wrap, ...otherG1 } = rowProps
  const { labelAlign, size, ...otherG2 } = formProps
  const colGlobalVariable = 'colProps'
  const formItemGlobalVariable = 'formItemProps'
  const rowPropsStr = generateProps({ gutter, align, justify, wrap })
  let children = ''
  const initialValues = {} as any
  componentList.forEach((item, index) => {
    children += createFormItem(
      item,
      target,
      index,
      componentList,
      colGlobalVariable,
      formItemGlobalVariable
    )
    if (item.componentProps?.defaultValue && item.formItemProps?.name) {
      initialValues[item.formItemProps.name] = item.componentProps?.defaultValue
    }
  })
  const initialValuesStr = Object.keys(initialValues).length
    ? ` initialValues={${JSON.stringify(initialValues)}}`
    : ''
  return `
  export default () => {
    const ${colGlobalVariable} = ${JSON.stringify(otherG1)}
    const ${formItemGlobalVariable} = ${JSON.stringify(otherG2)}

    return <Form${initialValuesStr}>
        <Row${rowPropsStr}>
          ${children}
        </Row>
    </Form>
  }
  `
}

/**
 * 寻找所有使用到的组件Key
 */
function getAllAntdComponentKey(
  componentList: IFormComProp[],
  keys = new Set<string>()
) {
  componentList.forEach((item) => {
    if (!['List1'].includes(item.componentKey)) {
      keys.add(item.componentKey)
    }
  })
  keys.add('Form')
  keys.add('Row')
  keys.add('Col')
  return Array.from(keys)
}

/**
 * 寻找所有使用到的ICON
 */
function getAllIcon(componentList: IFormComProp[], keys = new Set<string>()) {
  componentList.forEach((item) => {
    const { componentProps = {} } = item
    const { prefix, suffix } = componentProps
    prefix && keys.add(prefix)
    suffix && keys.add(suffix)
  })
  return Array.from(keys)
}

/**
 * 生成模块引用代码
 */
function generateImport(componentList: IFormComProp[]) {
  const componentkeys = getAllAntdComponentKey(componentList)
  const iconKeys = getAllIcon(componentList)
  const childImport = {} as any
  const parentImport = Array.from(
    new Set(
      componentkeys.map((item) => {
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
  const importReact = `import React from "react"\n`
  const importAntd = `import {${parentImport}} from 'antd'\n`
  let importOther = `` // 其他组件
  componentList
    .filter((item) => item.componentKey === 'List1')
    .forEach((item) => {
      const name = `List1`
      const tag = item.id.toString().slice(0, 4)
      importOther += `import ${name}${tag} from './${name}-${tag}'\n`
    })
  let importAntdChild = ''
  Object.keys(childImport).forEach((key) => {
    const item = childImport[key]
    if (item.length) {
      importAntdChild += `const {${item}} = ${key}\n`
    }
  })
  const importIcons = `import {${iconKeys}} from "@ant-design/icons";\n`
  let result = importReact + importAntd
  if (iconKeys.length) {
    result += importIcons
  }
  if (importOther) {
    result += importOther
  }
  if (importAntdChild) {
    result += '\n' + importAntdChild
  }
  return result
}

export { generate, generateImport }
