import React, { useEffect, useContext } from "react";
import { Form, Input } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST } from "../stores/action-type";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

/**
 * 部分组件的公用属性设置
 */
export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};
  const onValuesChange = (changedValues: any, allValues: any) => {
    commonDispatch({
      type: UPDATE_COMPONENT_LIST,
      payload: {
        id,
        data: {
          componentProps: {
            ...allValues,
          },
        },
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [componentProps, currentDragComponent, form]);
  return (
    <>
      <Form form={form} {...layout} onValuesChange={onValuesChange}>
        <Form.Item label="占位提示" name="placeholder">
          <Input />
        </Form.Item>
        <Form.Item label="组件宽度" name="componentWidth">
          <Input />
        </Form.Item>
        <Form.Item label="默认值" name="defaultValue">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
}
