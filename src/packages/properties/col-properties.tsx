import React, { useContext } from "react";
import { Divider, Form, Slider } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
}

export default function () {
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id /*  colProps = {} */ } = currentDragComponent || {};
  
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
  
  return (
    <Form
      {...layout}
      onValuesChange={onValuesChange}
    >
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>Col属性</Divider>
      <Form.Item label="栅格数(span)" name="span">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xs)" name="xs">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(sm)" name="sm">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(md)" name="md">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(lg)" name="lg">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xl)" name="xl">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      <Form.Item label="栅格数(xxl)" name="xxl">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
    </Form>
  );
}
