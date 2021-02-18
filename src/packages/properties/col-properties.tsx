import React, { useContext, useState } from "react";
import { Divider, Form, Slider, Button } from "antd";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

export default function () {
  const [showMore, setShowMore] = useState(false);
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
    <Form {...layout} onValuesChange={onValuesChange}>
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>列属性</Divider>
      <Form.Item label="栅格数1" tooltip="栅格占位格数" name="span">
        <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
      </Form.Item>
      {showMore && (
        <>
          <Form.Item
            label="栅格数2"
            name="xs"
            tooltip="屏幕 < 576px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
          <Form.Item
            label="栅格数3"
            name="sm"
            tooltip="屏幕 ≥ 576px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
          <Form.Item
            label="栅格数4"
            name="md"
            tooltip="屏幕 ≥ 768px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
          <Form.Item
            label="栅格数5"
            name="lg"
            tooltip="屏幕 ≥ 992px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
          <Form.Item
            label="栅格数6"
            name="xl"
            tooltip="屏幕 ≥ 1200px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
          <Form.Item
            label="栅格数7"
            name="xxl"
            tooltip="屏幕 ≥ 1600px 响应式栅格"
          >
            <Slider marks={{ 0: "0", 12: "12", 24: "24" }} min={0} max={24} />
          </Form.Item>
        </>
      )}
      <Button
        type="link"
        block
        style={{ marginTop: "-20px" }}
        icon={showMore ? <UpOutlined /> : <DownOutlined />}
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        {showMore ? "收起更多" : "查看更多"}
      </Button>
    </Form>
  );
}
