import React, { useContext, useEffect, useState } from "react";
import { Divider, Form, Collapse, Typography, InputNumber } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";
import { CaretRightOutlined } from "@ant-design/icons";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";

const { Panel } = Collapse;

export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, colProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          colProps: {
            ...allValues,
          },
        },
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(colProps);
  }, [colProps, currentDragComponent, form]);

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Typography.Title level={5}>
        <Typography.Text type="secondary" style={{ paddingLeft: 10 }}>
          栅格属性
        </Typography.Text>
      </Typography.Title>
      <Collapse
        defaultActiveKey={["栅格数"]}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header="固定栅格数"
          key="固定栅格数"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="栅格数" tooltip="栅格占位格数" name="span">
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
        </Panel>
        <Panel
          header="动态栅格数"
          key="动态栅格数"
          className="site-collapse-custom-panel"
        >
          <Form.Item
            label="XS栅格数"
            name="xs"
            tooltip="屏幕 < 576px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="SM栅格数"
            name="sm"
            tooltip="屏幕 ≥ 576px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="MD栅格数"
            name="md"
            tooltip="屏幕 ≥ 768px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="LG栅格数"
            name="lg"
            tooltip="屏幕 ≥ 992px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="XL栅格数"
            name="xl"
            tooltip="屏幕 ≥ 1200px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="XXL栅格数"
            name="xxl"
            tooltip="屏幕 ≥ 1600px 响应式栅格"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
        </Panel>
      </Collapse>
    </Form>
  );
}
