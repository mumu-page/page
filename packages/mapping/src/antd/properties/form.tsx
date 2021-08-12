import React, { useCallback, useEffect } from 'react'
import { Form, Input, InputNumber, Radio } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../../constants/constants'
import { SET_TARGET, refreshTarget, useStore } from '@r-generator/stores'
import { CheckboxField } from '../../components'
import { debounce, isNumber } from 'lodash'
import { Collapse, Title } from '../../components'

export default function () {
  const { target, moveableOptions, setGlobal, commonProps } = useStore()
  const [form] = Form.useForm()

  const onValuesChange = useCallback(
    debounce((_changedValues: any, allValues: any) => {
      const { wrapperCol, labelCol, ...other } = allValues
      if (isNumber(wrapperCol) || isNumber(labelCol)) {
        refreshTarget(moveableOptions?.target, setGlobal)
      }
      const wrapperColObj = {
        span: wrapperCol,
      }
      const labelColObj = {
        span: labelCol,
      }
      other.wrapperCol = wrapperColObj
      other.labelCol = labelColObj
      setGlobal({
        type: SET_TARGET,
        payload: {
          id: target.id,
          formProps: other,
        },
      })
    }, 200),
    [target.id]
  )

  const updateFormValues = () => {
    const { wrapperCol, labelCol, ...other } = commonProps?.form
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
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      initialValues={{
        size: 'middle',
        labelAlign: 'right',
      }}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Title text="表单" />
      <Collapse defaultActiveKey={['表单项']}>
        <Collapse.Panel header="表单" key="表单">
          <Form.Item label="表单名" name="name">
            <Input />
          </Form.Item>
          <Form.Item
            label="标签布局"
            tooltip="label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}。你可以通过 Form 的 labelCol 进行统一设置，，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准"
            name="labelCol"
          >
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="控件布局"
            tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 labelCol。你可以通过 Form 的 wrapperCol 进行统一设置，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准"
            name="wrapperCol"
          >
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="表单尺寸" name="size">
            <Radio.Group style={{ width: '100%' }}>
              <Radio.Button
                value="large"
                style={{ width: '33.3%', textAlign: 'center' }}
              >
                大
              </Radio.Button>
              <Radio.Button
                value="middle"
                style={{ width: '33.3%', textAlign: 'center' }}
              >
                中
              </Radio.Button>
              <Radio.Button
                value="small"
                style={{ width: '33.3%', textAlign: 'center' }}
              >
                小
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="标签对齐" name="labelAlign">
            <Radio.Group style={{ width: '100%' }}>
              <Radio.Button
                value="left"
                style={{ width: '50%', textAlign: 'center' }}
              >
                左对齐
              </Radio.Button>
              <Radio.Button
                value="right"
                style={{ width: '50%', textAlign: 'center' }}
              >
                右对齐
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="disabled">
            <CheckboxField
              tooltipTitle="是否禁用状态，默认为 false"
              text="禁用表单"
            />
          </Form.Item>
          <Form.Item label="" name="showbtn" valuePropName="checked">
            <CheckboxField tooltipTitle="是否显示表单按钮" text="表单按钮" />
          </Form.Item>
          <Form.Item label="" name="bordered" valuePropName="checked">
            <CheckboxField tooltipTitle="显示未选中组件边框" text="显示边框" />
          </Form.Item>
        </Collapse.Panel>
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
      </Collapse>
    </Form>
  )
}
