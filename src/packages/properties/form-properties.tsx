import React, { useContext } from "react";
import {
  Checkbox,
  Collapse,
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";
import { SET_CURRENT_DRAG_COMPONENT, UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";
import { Context } from "../stores/context";

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const [form] = Form.useForm();
  const { id, formItemProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { wrapperCol, labelCol } = allValues;
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        formItemProps: {
          ...allValues,
          wrapperCol: { span: wrapperCol },
          labelCol: { span: labelCol },
        },
      },
    });
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
    });
  };

  return (
    <Form {...FORM_PROPERTIES_OPTIONS} onValuesChange={onValuesChange}>
      <Typography.Title level={5}>
        <Typography.Text type="secondary" style={{ paddingLeft: 10 }}>
          表单属性
        </Typography.Text>
      </Typography.Title>
      <Collapse
        defaultActiveKey={["表单"]}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header="表单"
          key="表单"
          className="site-collapse-custom-panel"
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
          <Form.Item label="" valuePropName="checked" name="disabled">
            <Checkbox>
              <Tooltip title="是否禁用状态，默认为 false">禁用表单</Tooltip>
            </Checkbox>
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="showButton">
            <Checkbox>
              <Tooltip title="是否显示表单按钮">表单按钮</Tooltip>
            </Checkbox>
          </Form.Item>
          <Form.Item
            label=""
            name="showOtherBorder"
            valuePropName="checked"
          >
            <Checkbox>
              <Tooltip title="显示未选中组件边框">显示边框</Tooltip>
            </Checkbox>
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel
          header="表单项"
          key="表单项"
          className="site-collapse-custom-panel"
        >
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
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
}
