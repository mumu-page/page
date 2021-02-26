import React, { useContext, useEffect } from "react";
import { Collapse, Form, Input, InputNumber, Switch } from "antd";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { Context } from "../stores/context";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";

interface FormData {
  [key: string]: any;
}

let shouldUpdate = true;
export default function () {
  const [form] = Form.useForm<FormData>();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    shouldUpdate = false;
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          defaultValue: allValues?.defaultValue,
        },
      },
    });
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          componentProps: allValues,
        },
      },
    });
  };

  useEffect(() => {
    if (!shouldUpdate) return;
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [componentProps, currentDragComponent, form]);

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Collapse
          // defaultActiveKey={["栅格数"]}
          className="site-collapse-custom-collapse"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Collapse.Panel
            header="文本域"
            key="文本域"
            className="site-collapse-custom-panel"
          >
            <Form.Item label="默认值" name="defaultValue">
              <Input
                onBlur={() => (shouldUpdate = true)}
                onPressEnter={() => (shouldUpdate = true)}
              />
            </Form.Item>
            <Form.Item label="最大长度" name="maxLength">
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="展示字数"
              valuePropName="checked"
              tooltip="	是否展示字数"
              name="showCount"
            >
              <Switch />
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
              label="自适应高"
              valuePropName="checked"
              // tooltip="自适应内容高度，可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }"
              tooltip="自适应内容高度，可设置为true或false"
              name="autoSize"
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
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  );
}
