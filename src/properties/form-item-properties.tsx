import React, { useCallback, useContext, useEffect } from "react";
import { Form, Input, InputNumber, Radio } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { Context } from "../stores/context";
import { decodeKey, encodeKey } from "../utils/utils";
import { CustomCollapse, Title } from "../components";
import { debounce } from "lodash";

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const [form] = Form.useForm();
  const { id, formProps = {}, formItemProps = {} } = currentDragComponent || {};

  const onValuesChange = useCallback(
    debounce((_changedValues: any, allValues: any) => {
      const newAllValues = decodeKey(allValues, ["form", "formItem"]);
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          formProps: newAllValues?.form,
          formItemProps: newAllValues?.formItem,
        },
      });
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          id,
          data: {
            formItemProps: newAllValues?.formItem,
          },
        },
      });
    }, 500),
    [currentDragComponent.id]
  );

  useEffect(() => {
    const values = encodeKey(
      {
        key: "form",
        data: formProps,
      },
      {
        key: "formItem",
        data: formItemProps,
      }
    );
    form.resetFields();
    form.setFieldsValue(values);
  }, [currentDragComponent]);

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Title text="表单项" />
      <CustomCollapse defaultActiveKey={["表单项"]}>
        <CustomCollapse.Panel header="表单项" key="表单项">
          <Form.Item label="字段名" name="formItem.name">
            <Input onPressEnter={(e) => {}} />
          </Form.Item>
          <Form.Item label="标题" name="formItem.label">
            <Input />
          </Form.Item>
          <Form.Item
            label="控件布局"
            tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。"
            name="formItem.wrapperCol"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="标签布局"
            tooltip="label 标签布局，同 <Col> 组件"
            name="formItem.labelCol"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="标签对齐" name="formItem.labelAlign">
            <Radio.Group>
              <Radio.Button value="left">左对齐</Radio.Button>
              <Radio.Button value="right">右对齐</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  );
}
