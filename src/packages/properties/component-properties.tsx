import React, { useContext, useEffect } from "react";
import { Form, Select, Divider } from "antd";
import { options, key2Component } from "../constants";
import FormItemProperties from "./form-item-properties";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST,
} from "../stores/action-type";
import { componentKeys } from "../stores/typings";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};
const { Option, OptGroup } = Select;
interface FormData {
  componentKey: componentKeys;
}
export default function () {
  const [form] = Form.useForm<FormData>();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id } = currentDragComponent;
  const onValuesChange = (changedValues: any, allValues: FormData) => {
    commonDispatch({
      type: UPDATE_COMPONENT_LIST,
      payload: {
        id,
        data: {
          componentKey: allValues?.componentKey,
        },
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue({
      componentKey: currentDragComponent.componentKey,
    });
  }, [currentDragComponent, form]);

  return (
    <>
      <Form {...layout} form={form} onValuesChange={onValuesChange}>
        <Form.Item label="组件类型" name="componentKey">
          <Select>
            {options.map((item) => {
              return (
                <OptGroup label={item.label} key={item.key}>
                  {Array.isArray(item.children) &&
                    item.children.map((childItem) => {
                      return (
                        <Option key={childItem.key} value={childItem.value}>
                          {childItem.label}
                        </Option>
                      );
                    })}
                </OptGroup>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>
        表单字段组件
      </Divider>
      <FormItemProperties />
      {currentDragComponent.componentKey && (
        <Divider style={{ padding: "0 20px", fontSize: "14px" }}>控件</Divider>
      )}
      {key2Component[currentDragComponent.componentKey].properties}
    </>
  );
}
