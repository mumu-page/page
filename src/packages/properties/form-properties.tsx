import React, { useState } from "react";
import { Form, Input, InputNumber, Radio, Switch } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";

type SizeType = Parameters<typeof Form>[0]["size"];

export default function () {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const onFormLayoutChange = ({
    size,
  }: {
    size: SizeType;
    labelAlign: "left" | "right";
  }) => {
    setComponentSize(size);
  };
  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
    >
      <Form.Item label="表单名" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="表单模型" name="initialValues">
        <Input />
      </Form.Item>
      <Form.Item label="表单尺寸" name="size">
        <Radio.Group>
          <Radio.Button value="large">中等</Radio.Button>
          <Radio.Button value="default">较小</Radio.Button>
          <Radio.Button value="small">迷你</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="标签对齐" name="labelAlign">
        <Radio.Group>
          <Radio.Button value="left">左对齐</Radio.Button>
          <Radio.Button value="right">右对齐</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="栅格间隔" name="gutter">
        <InputNumber />
      </Form.Item>

      <Form.Item label="禁用表单" valuePropName="checked" name="disabled">
        <Switch />
      </Form.Item>

      <Form.Item label="表单按钮" valuePropName="checked" name="showButton">
        <Switch />
      </Form.Item>

      <Form.Item
        label="显示边框"
        tooltip="显示未选中组件边框"
        name="showOtherBorder"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  );
}
