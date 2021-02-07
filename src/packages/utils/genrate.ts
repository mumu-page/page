import { FormComProp } from '../stores/typings'

function createFormItem(item: FormComProp) {
  const { formItemProps, componentProps, componentKey } = item
  let formItemPropsStr = ''
  let componentPropsStr = ''
  Object.keys(formItemProps).forEach((key) => {
    const value = JSON.stringify(formItemProps[key])
    if (typeof value !== 'undefined') {
      formItemPropsStr += ` ${key}={${value}}`
    }
  })
  const { defaultValue, ...componentOtherProps } = componentProps
  const componentPropsKey = Object.keys(componentOtherProps)
  if (['Input'].includes(componentKey)) {
    if (componentPropsKey.includes('prefix')) {
      const IconComponent = componentOtherProps['prefix'] || 'React.Fragment'
      componentOtherProps['prefix'] = `<${IconComponent} />`
    }
    if (componentPropsKey.includes('suffix')) {
      const IconComponent = componentOtherProps['suffix'] || 'React.Fragment'
      componentOtherProps['suffix'] = `<${IconComponent} />`
    }
  }
  componentPropsKey.forEach((key) => {
    let value = JSON.stringify(componentOtherProps[key])
    if (['prefix', 'suffix'].includes(key)) {
      value = value?.replace(/"/g, '')
    }
    if (typeof value !== 'undefined') {
      componentPropsStr += ` ${key}={${value}}`
    }
  })
  let ret = `<Form.Item${formItemPropsStr}>
        <${componentKey}${componentPropsStr} />
    </Form.Item>`
  return ret
}

function generate(componentList: FormComProp[]) {
  let ret = ''
  const initialValues = {} as any;
  componentList.forEach((item) => {
    ret += createFormItem(item)
    if (item.componentProps?.defaultValue && item.formItemProps?.name) {
      initialValues[item.formItemProps.name] =
        item.componentProps?.defaultValue;
    }
  })
  return `<Form initialValues={${JSON.stringify(initialValues)}}>
        ${ret}
    </Form>`;
}

export { generate }
