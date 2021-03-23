import React, { useCallback, useContext, useEffect } from "react";
import { Collapse, Form, Input, InputNumber, Radio } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_MOVEABLE_OPTIONS,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { Context } from "../stores/context";
import CheckboxField from "../components/FormFields/CheckboxField";
import { decodeKey, encodeKey, refreshTarget } from "../utils/utils";
import { CustomCollapse, Title } from "../components";
import { debounce } from "lodash";

export default function () {
  const { currentDragComponent, moveableOptions, commonDispatch } = useContext(
    Context
  );
  const [form] = Form.useForm();
  const { id, formProps = {}, formItemProps = {} } = currentDragComponent || {};
  const { target } = moveableOptions || {};

  const onValuesChange = useCallback(
    debounce((_changedValues: any, allValues: any) => {
      const newAllValues = decodeKey(allValues, ["form", "formItem"]);
      const { wrapperCol, labelCol } = newAllValues.form;
      if (typeof wrapperCol === "number") {
        newAllValues.form.wrapperCol = { span: wrapperCol };
      }
      if (typeof labelCol === "number") {
        newAllValues.form.labelCol = { span: labelCol };
      }
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          formProps: newAllValues.form,
          formItemProps: newAllValues.formItem,
        },
      });
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          id,
          data: {
            formItemProps: newAllValues.formItem,
          },
        },
      });
      // 重新获取当前选中元素
      refreshTarget(target, commonDispatch);
    }, 500),
    []
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
    if (typeof values["form.labelCol"] === "object") {
      values["form.labelCol"] = values["form.labelCol"].span;
    }
    if (typeof values["form.wrapperCol"] === "object") {
      values["form.wrapperCol"] = values["form.wrapperCol"].span;
    }
    form.resetFields();
    form.setFieldsValue(values);
  }, [currentDragComponent]);

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Title text="表单" />
      <CustomCollapse defaultActiveKey={["表单"]}>
        <CustomCollapse.Panel header="表单" key="表单">
          <Form.Item label="表单名" name="form.name">
            <Input />
          </Form.Item>
          <Form.Item
            label="标签布局"
            tooltip="label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}。你可以通过 Form 的 labelCol 进行统一设置，，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准"
            name="form.labelCol"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="控件布局"
            tooltip="需要为输入控件设置布局样式时，使用该属性，用法同 labelCol。你可以通过 Form 的 wrapperCol 进行统一设置，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准"
            name="form.wrapperCol"
          >
            <InputNumber min={0} max={24} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="表单模型" name="form.initialValues">
            <Input />
          </Form.Item>
          <Form.Item label="表单尺寸" name="form.size">
            <Radio.Group>
              <Radio.Button value="large">大</Radio.Button>
              <Radio.Button value="middle">中</Radio.Button>
              <Radio.Button value="small">小</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="标签对齐" name="form.labelAlign">
            <Radio.Group>
              <Radio.Button value="left">左对齐</Radio.Button>
              <Radio.Button value="right">右对齐</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="form.disabled">
            <CheckboxField
              tooltipTitle="是否禁用状态，默认为 false"
              text="禁用表单"
            />
          </Form.Item>
          <Form.Item label="" valuePropName="checked" name="form.showButton">
            <CheckboxField tooltipTitle="是否显示表单按钮" text="表单按钮" />
          </Form.Item>
          <Form.Item label="" name="form.bordered" valuePropName="checked">
            <CheckboxField tooltipTitle="显示未选中组件边框" text="显示边框" />
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  );
}
