import React from "react";
import { Divider, Form, Slider, Switch, Select } from "antd";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
}

export default function () {
  const onValuesChange = (changedValues: any, allValues: any) => {};
  
  return (
    <Form
      {...layout}
      initialValues={{
        align: "top",
        gutter: 0,
        justify: "start",
        wrap: true,
      }}
      onValuesChange={onValuesChange}
    >
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>Row属性</Divider>
      <Form.Item label="垂直对齐" name="align">
        <Select>
          <Select.Option value="top">靠上</Select.Option>
          <Select.Option value="middle">居中</Select.Option>
          <Select.Option value="bottom">靠下</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="水平排列" name="justify">
        <Select>
          <Select.Option value="start">水平靠左分布</Select.Option>
          <Select.Option value="middle">水平靠右分布</Select.Option>
          <Select.Option value="center">水平居中分布</Select.Option>
          <Select.Option value="space-around">水平平均分布</Select.Option>
          <Select.Option value="space-between">水平两侧顶格分布</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="自动换行" name="wrap" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="栅格间隔" name="gutter">
        <Slider
          marks={{ 0: "0", 24: "24", 48: "48", 72: "72", 100: "100" }}
          min={0}
          max={100}
        />
      </Form.Item>
    </Form>
  );
}
