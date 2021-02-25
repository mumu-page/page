import React, { useContext, useEffect } from 'react'
import { Form, Input, Slider, Radio, Divider, InputNumber } from "antd";
import { Context } from '../stores/context'
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from '../stores/action-type'
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context)
  const [form] = Form.useForm()
  const { id, formItemProps = {} } = currentDragComponent || {}

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { wrapperCol, labelCol } = allValues
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          formItemProps: {
            ...allValues,
            wrapperCol: { span: wrapperCol },
            labelCol: { span: labelCol },
          },
        },
      },
    })
  }

  useEffect(() => {
    const { wrapperCol = {}, labelCol = {} } = formItemProps as any
    form.resetFields()
    form.setFieldsValue({
      ...formItemProps,
      wrapperCol: wrapperCol?.span,
      labelCol: labelCol?.span,
    })
  }, [currentDragComponent, form, formItemProps])

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        initialValues={{
          labelAlign: "right",
          span: 24,
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Divider style={{ padding: "0 20px", fontSize: "14px" }}>
          表单项属性
        </Divider>
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
          <InputNumber min={0} max={24} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="标签布局"
          tooltip="label 标签布局，同 <Col> 组件"
          name="labelCol"
        >
          <InputNumber min={0} max={24} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="标签对齐" name="labelAlign">
          <Radio.Group>
            <Radio.Button value="left">左对齐</Radio.Button>
            <Radio.Button value="right">右对齐</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
}
