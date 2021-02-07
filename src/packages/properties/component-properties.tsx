import React, { useContext, useEffect } from 'react'
import { Form, Select, Empty } from 'antd'
import { options, key2Component } from '../constants'
import FormItemProperties from './form-item-properties'
import { Context } from '../stores/context'
import { UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG } from '../stores/action-type'
import { ComponentKeys } from '../stores/typings'
import { isDatePicker } from '../utils/utils'
import { CommonProperties } from '.'

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
}
const { Option, OptGroup } = Select
interface FormData {
  componentKey: ComponentKeys
}
export default function () {
  const [form] = Form.useForm<FormData>()
  const { componentList, currentDragComponent, commonDispatch } = useContext(
    Context
  )

  const onValuesChange = (changedValues: any, allValues: FormData) => {
    const { componentKey } = allValues
    const newComponentProps = {} as any
    if (isDatePicker(allValues.componentKey)) {
      newComponentProps.defaultValue = ''
    }
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG,
      payload: {
        componentKey,
        newComponentProps,
      },
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      componentKey: currentDragComponent.componentKey,
    })
  }, [currentDragComponent, form])

  return (
    <>
      {componentList.length && currentDragComponent?.id ? (
        <>
          <Form {...layout} form={form} onValuesChange={onValuesChange}>
            <Form.Item label="组件类型" name="componentKey">
              <Select>
                {options.map((item) => {
                  return (
                    <OptGroup label={item.label} key={item.key}>
                      {Array.isArray(item.children) &&
                        item.children.map((childItem) => {
                          return (
                            <Option key={childItem.key} value={childItem.value}>
                              {childItem.label}
                            </Option>
                          );
                        })}
                    </OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
          <FormItemProperties />
          <CommonProperties />
          {key2Component[currentDragComponent.componentKey].properties}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
      )}
    </>
  );
}
