import React, { useContext, useState } from "react";
import { Form, Input, InputNumber, Radio, Switch } from "antd";
import { CommonProperties } from "./index";
import { Context } from "../stores/context";
import { SET_CURRENT_DRAG_COMPONENT } from "../stores/action-type";

type SizeType = Parameters<typeof Form>[0]["size"];
const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};
export default function () {
  const [form] = Form.useForm();
  const { commonDispatch } = useContext(Context);

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("onValuesChange", allValues);
    commonDispatch({ type: SET_CURRENT_DRAG_COMPONENT, payload: allValues });
  };
  return (
    <>
      <CommonProperties />
      <Form form={form} {...layout} onValuesChange={onValuesChange}>
        <Form.Item label="输入框内容" name="value">
          <Input />
        </Form.Item>
        <Form.Item
          label="前置"
          tooltip="带标签的 input，设置前置标签"
          name="addonBefore"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="后置"
          tooltip="带标签的 input，设置后置标签"
          name="addonAfter"
        >
          <Input />
        </Form.Item>
        <Form.Item label="最大长度" name="maxLength">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="控件大小"
          tooltip="注：标准表单内的输入框大小限制为 large"
          name="size"
        >
          <Radio.Group>
            <Radio.Button value="large">较大</Radio.Button>
            <Radio.Button value="middle">中等</Radio.Button>
            <Radio.Button value="small">迷你</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="支持清除"
          valuePropName="checked"
          tooltip="可以点击清除图标删除内容"
          name="allowClear"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="显示边框"
          valuePropName="checked"
          tooltip="是否有边框"
          name="bordered"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="是否禁用"
          valuePropName="checked"
          tooltip="是否禁用状态，默认为 false"
          name="disabled"
        >
          <Switch />
        </Form.Item>
      </Form>
    </>
  );
}
