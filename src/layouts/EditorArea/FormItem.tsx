import * as React from 'react'
import { Form } from 'antd'
import { IFormComProp } from '../../stores/typings'
import { isCheck, isDatePicker, isRenderFormItem } from '../../utils/utils'
import { getComponent } from '../../constants'
import * as moment from 'moment'
import { getIcon } from '../../utils/genrate'

// 控件设计时默认不能交互
const disableCom = {
  readOnly: true,
  //   popupVisible: false,
  open: false,
}

export default (prop: IFormComProp) => {
  const {
    id,
    children,
    componentKey,
    formProps = {},
    formItemProps = {},
    componentProps = {},
    rowProps = {},
    form,
    className,
    style,
  } = prop

  // 1.如果是日期类控件，但值不是moment类型，清除值
  // 2.如果是级联控件，清除值
  if (
    (isDatePicker(componentKey) &&
      !moment.isMoment(form?.getFieldValue(formItemProps.name))) ||
    ['Cascader'].includes(componentKey)
  ) {
    form?.setFieldsValue({
      [formItemProps.name]: '',
    })
  }

  const {
    defaultValue,
    prefix,
    suffix,
    ...componentOtherProps
  } = componentProps
  // 输入框前后图标处理
  if (['Input'].includes(componentKey)) {
    const Prefix = getIcon(prefix, true)
    const Suffix = getIcon(suffix, true)
    componentOtherProps['prefix'] = <Prefix />
    componentOtherProps['suffix'] = <Suffix />
  }

  const { labelCol: labelColG = {}, wrapperCol: wrapperColG = {} } = formProps
  const { labelCol = {}, wrapperCol = {} } = formItemProps
  const propObj = {
    ...formItemProps,
    labelCol: {
      ...labelColG,
      ...labelCol,
    },
    wrapperCol: {
      ...wrapperColG,
      ...wrapperCol,
    },
  }

  return isRenderFormItem(componentKey) ? (
    <Form.Item
      {...propObj}
      style={style}
      className={className}
      valuePropName={isCheck(componentKey) ? 'checked' : 'value'}
    >
      {React.cloneElement(getComponent(componentKey) || <></>, {
        disabled: componentKey === 'Rate',
        ...disableCom,
        ...componentOtherProps,
      })}
    </Form.Item>
  ) : (
    React.cloneElement(getComponent(componentKey) || <></>, {
      id,
      children,
      rowProps,
      ...componentOtherProps,
    })
  )
}
