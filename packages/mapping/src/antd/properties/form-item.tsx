import React, { useCallback, useEffect } from 'react'
import { Form, Input, InputNumber, Radio } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../../constants'
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  useStore,
  refreshTarget,
} from '@r-generator/stores'
import { Title, Collapse } from '../../components'
import { debounce, isNumber } from 'lodash'

export default function () {
  const { moveableOptions, target, setGlobal: commonDispatch } = useStore()
  const [form] = Form.useForm()
  const { id, formItem = {} } = target || {}

  const onValuesChange = useCallback(
    debounce((_changedValues: any, allValues: any) => {
      const { wrapperCol, labelCol, ...other } = allValues
      if (isNumber(wrapperCol) || isNumber(labelCol)) {
        refreshTarget(moveableOptions?.target, commonDispatch)
      }
      if (isNumber(wrapperCol)) {
        const wrapperColObj = {
          span: wrapperCol,
        }
        other.wrapperCol = wrapperColObj
      }
      if (isNumber(labelCol)) {
        const labelColObj = {
          span: labelCol,
        }
        other.labelCol = labelColObj
      }
      commonDispatch({
        type: SET_TARGET,
        payload: {
          id,
          formItemProps: other,
        },
      })
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_TARGET,
        payload: {
          id,
          data: {
            formItemProps: other,
          },
        },
      })
    }, 100),
    [target?.id]
  )

  const updateFormValues = () => {
    const { wrapperCol, labelCol, ...other } = formItem || {}
    const wrapperColVal = wrapperCol?.span
    const labelColVal = labelCol?.span
    other.wrapperCol = wrapperColVal
    other.labelCol = labelColVal
    form.resetFields()
    form.setFieldsValue(other)
  }

  useEffect(() => {
    updateFormValues()
  }, [target.id])

  return (
    <Collapse.Panel header="表单项" key="表单项">
      <Form.Item label="字段名" name="name">
        <Input onPressEnter={(e) => {}} />
      </Form.Item>
      <Form.Item label="标题" name="label">
        <Input />
      </Form.Item>
      <Form.Item
        label="控件布局"
        tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。"
        name="wrapperCol"
      >
        <InputNumber min={0} max={24} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="标签布局"
        tooltip="label 标签布局，同 <Col> 组件"
        name="labelCol"
      >
        <InputNumber min={0} max={24} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="标签对齐" name="labelAlign">
        <Radio.Group>
          <Radio.Button value="left">左对齐</Radio.Button>
          <Radio.Button value="right">右对齐</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Collapse.Panel>
  )
}
