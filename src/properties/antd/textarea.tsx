import React, { useContext, useEffect } from "react";
import { Collapse, Form, Input, InputNumber, Switch } from "antd";
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from "../../stores/action-type";
import { Context } from "../../stores/context";
import { FORM_PROPERTIES_OPTIONS } from "../../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";
import CheckboxField from "../../components/FormFields/CheckboxField";
import { CustomCollapse } from "../../components";

interface FormData {
  [key: string]: any;
}

export default function () {
  const [form] = Form.useForm<FormData>();
  const { target: currentDragComponent, setGlobal: commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: any) => {
    commonDispatch({
      type: SET_TARGET,
      payload: {
        id,
        componentProps: {
          defaultValue: allValues?.defaultValue,
        },
      },
    });
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_TARGET,
      payload: {
        id,
        data: {
          componentProps: allValues,
        },
      },
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [currentDragComponent?.id]);

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        form={form}
        onValuesChange={onValuesChange}
      >
        <CustomCollapse defaultActiveKey={["基本"]}>
          <CustomCollapse.Panel header="基本">
            <Form.Item label="默认值" name="defaultValue">
              <Input />
            </Form.Item>
            <Form.Item label="最大长度" name="maxLength">
              <InputNumber />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="showCount">
              <CheckboxField tooltipTitle="是否展示字数" text="展示字数" />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="allowClear">
              <CheckboxField
                tooltipTitle="可以点击清除图标删除内容"
                text="支持清除"
              />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="bordered">
              <CheckboxField tooltipTitle="是否有边框" text="显示边框" />
            </Form.Item>
          </CustomCollapse.Panel>
          <CustomCollapse.Panel
            header={
              <Form.Item
                label=""
                valuePropName="checked"
                name="autoSize"
                className="mb-0"
              >
                <CheckboxField
                  tooltipTitle="自适应内容高度，可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }"
                  text="自适应高"
                />
              </Form.Item>
            }
          >
            <Form.Item label="最小行数" name="autoSize.minRows">
              <InputNumber />
            </Form.Item>
            <Form.Item label="最大行数" name="autoSize.maxRows">
              <InputNumber />
            </Form.Item>
          </CustomCollapse.Panel>
        </CustomCollapse>
      </Form>
    </>
  );
}
