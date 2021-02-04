import React, { useEffect, useContext } from "react";
import { Form, Input, Slider } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST } from "../stores/action-type";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

interface FormData {
  componentWidth: string;
  placeholder: string;
}
/**
 * 部分组件的公用属性设置
 */
export default function () {
  const [form] = Form.useForm<FormData>();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};
  const onValuesChange = (changedValues: any, allValues: FormData) => {
    const {placeholder, componentWidth} = allValues
    const style = {
      width: componentWidth + '%'
    }
    commonDispatch({
      type: UPDATE_COMPONENT_LIST,
      payload: {
        id,
        data: {
          componentProps: {
            placeholder,
            style,
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
          <Slider defaultValue={100} marks={{ 0: '0%', 50: "50%", 100: "100%" }} min={0} max={100} tipFormatter={val => val + '%'} />
        </Form.Item>
      </Form>
    </>
  );
}
