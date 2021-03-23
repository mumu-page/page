import React, { useContext, useRef } from "react";
import { Button, Form, Radio, Select } from "antd";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CustomCollapse, IRefType, SelectModal } from "../components";
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from "../stores/action-type";
import { Context } from "../stores/context";

export default function () {
  const { target: currentDragComponent, commonDispatch } = useContext(Context);
  const modalRef = useRef<IRefType>(null);
  const [form] = Form.useForm();
  const { id } = currentDragComponent || {};

  const showModal = () => {
    const options = form.getFieldValue("options");
    if (form.getFieldValue("options")) {
      modalRef.current?.setdataSource(options);
    }
    modalRef.current?.showModal();
  };

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      initialValues={{
        size: "middle",
      }}
    >
      <CustomCollapse defaultActiveKey={["下拉列表"]}>
        <CustomCollapse.Panel header="下拉列表" key="下拉列表">
          <Form.Item label="列表内选项" name="options">
            <Button type="dashed" block onClick={showModal}>
              配置数据
            </Button>
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>

      <SelectModal
        ref={modalRef}
        onOk={(options: any) => {
          form.setFieldsValue({
            options,
          });
          commonDispatch({
            type: SET_TARGET,
            payload: {
              id,
              componentProps: { options },
            },
          });
          commonDispatch({
            type: UPDATE_COMPONENT_LIST_BY_TARGET,
            payload: {
              id,
              data: {
                componentProps: { options },
              },
            },
          });
        }}
      />
    </Form>
  );
}
