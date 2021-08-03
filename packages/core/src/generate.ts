import { IComponentKeys, IFormComProp } from '@r-generator/stores'

export default class Generate {
  componentList: IFormComProp[]
  target: IFormComProp
  constructor(componentList: IFormComProp[], target: IFormComProp) {
    this.componentList = componentList
    this.target = target
  }
  run() {
    return `${this.generateImport()}${this.generateXml()}`
  }
  generateXml() {
    const { rowProps = {}, formProps = {} } = this.target
    const { colNum, gutter, align, justify, wrap, ...otherG1 } = rowProps
    const { labelAlign, size, ...otherG2 } = formProps
    const colGlobalVariable = 'colProps'
    const formItemGlobalVariable = 'formItemProps'
    const rowPropsStr = this.generateProps({ gutter, align, justify, wrap })
    let children = ''
    const initialValues = {} as any
    this.componentList.forEach((item, index) => {
      if (item.componentProps?.defaultValue && item.formItemProps?.name) {
        initialValues[item.formItemProps.name] =
          item.componentProps?.defaultValue
      }
      children += this.createFormItem(
        item,
        index,
        colGlobalVariable,
        formItemGlobalVariable
      )
    })
    const initialValuesStr = Object.keys(initialValues).length
      ? ` initialValues={${JSON.stringify(initialValues)}}`
      : ''
    return `
    export default () => {
      const ${colGlobalVariable} = ${JSON.stringify(otherG1)}
      const ${formItemGlobalVariable} = ${JSON.stringify(otherG2)}
      const [form] = Form.useForm()
      const onFinish = (values) => {
        console.log('Received values of form:', values)
      }
  
      return <Form${initialValuesStr} form={form} onFinish={onFinish}>
          <Row${rowPropsStr}>
            ${children}
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
      </Form>
    }
    `
  }
  generateProps(props: Record<string, any>, result = '') {
    Object.keys(props).forEach((key) => {
      const value = JSON.stringify(props[key])
      result += `${this.parseProp(key, value)}`
    })
    return result
  }
  createFormItem(
    item: IFormComProp,
    index: number,
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
    const colPropsStr = this.generateProps({ ...otherColProps })
    const formItemPropsStr = this.generateProps({
      // style,
      ...formItemProps,
      labelCol,
      wrapperCol,
    })
    const componentPropsStr = this.generateComProps(
      componentProps,
      componentKey
    )
    let componentName = ''
    // 可能会设计多个List1 用一个唯一标识区分他们
    if (item.componentKey === 'List1') {
      componentName = `${item.componentKey}${String(item.id).slice(0, 4)}`
      return `<Col {...${colGlobalVariable}}${colPropsStr}>
              <${componentName} {...${formItemGlobalVariable}} form={form}${formItemPropsStr}${componentPropsStr} />
            </Col>${this.componentList.length - 1 === index ? '' : '\n'}`
    } else {
      componentName = componentKey?.replace(/^.*\./, '')
    }
    // TODO render children
    const Component =
      componentKey === 'Upload'
        ? `<${componentName}${componentPropsStr}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </${componentName}>`
        : `<${componentName}${componentPropsStr} />`
    return `<Col {...${colGlobalVariable}}${colPropsStr}>
              <Form.Item {...${formItemGlobalVariable}}${formItemPropsStr}>
                ${Component}
              </Form.Item>
            </Col>${this.componentList.length - 1 === index ? '' : '\n'}`
  }
  generateComProps(
    componentProps: Record<string, any>,
    componentKey: IComponentKeys,
    result = ''
  ) {
    const { defaultValue, prefix, suffix, ...componentOtherProps } =
      componentProps
    // 处理输入框前后置图标
    if (['Input'].includes(componentKey)) {
      componentOtherProps['prefix'] = `<${prefix} />`
      componentOtherProps['suffix'] = `<${suffix} />`
    }
    // 控件参数
    Object.keys(componentOtherProps).forEach((key) => {
      let value = JSON.stringify(componentOtherProps[key])
      result += `${this.parseProp(key, value)}`
    })
    return result
  }
  parseProp(key: string, value: any, result = '') {
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
  getAllAntdComponentKey(
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
    keys.add('Button')
    return Array.from(keys)
  }
  // 寻找所有使用到的ICON
  getAllIcon(componentList: IFormComProp[], keys = new Set<string>()) {
    componentList.forEach((item) => {
      const { componentProps = {} } = item
      const { prefix, suffix } = componentProps
      prefix && keys.add(prefix)
      suffix && keys.add(suffix)
    })
    return Array.from(keys)
  }
  generateImport() {
    const componentkeys = this.getAllAntdComponentKey(this.componentList)
    const iconKeys = this.getAllIcon(this.componentList)
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
    this.componentList
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
}
