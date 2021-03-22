import React, { useRef } from "react";
import { Form, Input } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CustomCollapse, IRefType, Title } from "../components";

export default function () {
  const modalRef = useRef<IRefType>(null);
  const [form] = Form.useForm();

  const onValuesChange = (_: any, allValues: any) => {};

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{
        size: "middle",
      }}
    >
      <Title text="容器" />
      <CustomCollapse defaultActiveKey={["容器大小"]}>
        <CustomCollapse.Panel header="容器大小" key="容器大小">
          <Form.Item label="宽度" name="width">
            <Input />
          </Form.Item>
          <Form.Item label="高度" name="height">
            <Input />
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  );
}
