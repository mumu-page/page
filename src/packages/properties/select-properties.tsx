import React, { useState } from "react";
import { Button, Checkbox, Collapse, Form, Input, InputNumber, Radio, Switch } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";
import CheckboxField from "../components/FormFields/CheckboxField";

export default function () {
  const [form] = Form.useForm()
  
  const onFormLayoutChange = (_: any, allValues: any) => {
    
  };

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onFormLayoutChange}
    >
      <Collapse
        defaultActiveKey={["下拉框"]}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header="下拉框"
          key="下拉框"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="配置选项" name="options">
            <Button size="small" block>
              配置数据
            </Button>
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="allowClear">
            <Checkbox>支持清除</Checkbox>
          </Form.Item>
          <Form.Item
            label=""
            valuePropName="checked"
            name="autoClearSearchValue"
          >
            <CheckboxField
              tooltipTitle="是否在选中项后清空搜索框，只在 mode 为 multiple 或 tags 时有效"
              text="自动清空搜索框"
            />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
}
