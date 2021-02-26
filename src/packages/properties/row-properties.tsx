import React, { useContext, useEffect } from "react";
import {
  Divider,
  Form,
  Slider,
  Switch,
  Select,
  Collapse,
  InputNumber,
} from "antd";
import { Context } from "../stores/context";
import { SET_CURRENT_DRAG_COMPONENT, UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";
import CheckboxField from "../components/FormFields/CheckboxField";

export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, colProps = {}, rowProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { align, justify, gutter, ...colProps } = allValues;
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          colProps,
        },
      },
    });
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        colProps,
        rowProps: {
          align,
          justify,
          gutter,
        },
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...colProps,
      ...rowProps
    });
  }, [colProps, currentDragComponent, form]);

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      initialValues={{
        align: "top",
        gutter: 0,
        justify: "start",
        wrap: true,
      }}
      onValuesChange={onValuesChange}
    >
      <Collapse
        defaultActiveKey={["栅格数"]}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header="行布局"
          key="行布局"
          className="site-collapse-custom-panel"
        >
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
              <Select.Option value="space-between">
                水平两侧顶格分布
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="栅格间隔" name="gutter">
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item label="" name="wrap" valuePropName="checked">
            <CheckboxField tooltipTitle="是否自动换行" text="自动换行" />
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel
          header="固定栅格数"
          key="固定栅格数"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="栅格数" tooltip="栅格占位格数" name="span">
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel
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
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
}
