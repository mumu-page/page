import React, { useContext, useEffect } from 'react'
import { Collapse, Form, Input, InputNumber, Radio } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../constants/constants'
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from '../stores/action-type'
import { Context } from '../stores/context'
import { CaretRightOutlined } from '@ant-design/icons'
import CheckboxField from '../components/FormFields/CheckboxField'
import { formatObject } from '../utils/utils'

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context)
  const [form] = Form.useForm()
  const { id, formProps, formItemProps = {} } = currentDragComponent || {}

  const onValuesChange = (changedValues: any, allValues: any) => {
    const newAllValues = formatObject(allValues, ['form', 'formItem'])
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        formProps: newAllValues?.form,
        formItemProps: newAllValues?.formItem,
      },
    })
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          formItemProps: newAllValues?.formItem,
        },
      },
    })
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      ...formProps,
      ...formItemProps,
    })
  }, [])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Collapse
        defaultActiveKey={['表单']}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header="表单"
          key="表单"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="表单名" name="form.name">
            <Input />
          </Form.Item>
          <Form.Item label="表单模型" name="form.initialValues">
            <Input />
          </Form.Item>
          <Form.Item label="表单尺寸" name="form.size">
            <Radio.Group>
              <Radio.Button value="large">中等</Radio.Button>
              <Radio.Button value="default">较小</Radio.Button>
              <Radio.Button value="small">迷你</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="标签对齐" name="form.labelAlign">
            <Radio.Group>
              <Radio.Button value="left">左对齐</Radio.Button>
              <Radio.Button value="right">右对齐</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="form.disabled">
            <CheckboxField
              tooltipTitle="是否禁用状态，默认为 false"
              text="禁用表单"
            />
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="form.showButton">
            <CheckboxField tooltipTitle="是否显示表单按钮" text="表单按钮" />
          </Form.Item>
          <Form.Item label="" name="form.bordered" valuePropName="checked">
            <CheckboxField tooltipTitle="显示未选中组件边框" text="显示边框" />
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel
          header="表单项"
          key="表单项"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="字段名" name="formItem.name">
            <Input onPressEnter={(e) => {}} />
          </Form.Item>
          <Form.Item label="标题" name="formItem.label">
            <Input />
          </Form.Item>
          <Form.Item
            label="控件布局"
            tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。"
            name="formItem.wrapperCol"
          >
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="标签布局"
            tooltip="label 标签布局，同 <Col> 组件"
            name="formItem.labelCol"
          >
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="标签对齐" name="formItem.labelAlign">
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
