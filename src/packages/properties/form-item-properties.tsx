import React, { useContext, useEffect, } from "react";
import { Form, Input, Slider, Radio } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const [form] = Form.useForm()
  const { id, formItemProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { wrapperCol, labelCol } = allValues;
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
        }
      },
    });
  };

  useEffect(() => {
    const { wrapperCol = {}, labelCol = {} } = formItemProps as any
    form.resetFields()
    form.setFieldsValue({
      ...formItemProps,
      wrapperCol: wrapperCol?.span,
      labelCol: labelCol?.span,
    })
  }, [currentDragComponent])

  return (
    <>
      <Form
        {...layout}
        initialValues={{
          labelAlign: 'right'
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="字段名" name="name">
          <Input onPressEnter={e => {}}/>
        </Form.Item>
        <Form.Item label="标题" name="label">
          <Input />
        </Form.Item>
        <Form.Item
          label="表单栅格"
          tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。"
          name="wrapperCol"
        >
          <Slider marks={{ 0: "0", 12: "12", 24: "24" }} max={24} />
        </Form.Item>
        <Form.Item
          label="标签布局"
          tooltip="label 标签布局，同 <Col> 组件"
          name="labelCol"
        >
          <Slider marks={{ 0: "0", 12: "12", 24: "24" }} max={24} />
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
