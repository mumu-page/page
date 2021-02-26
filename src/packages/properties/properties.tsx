import React, { useContext } from "react";
import { Empty, Form } from "antd";
import { getProperties } from "../constants";
import { Context } from "../stores/context";
import { CommonProperties, /* RowProperties, */ ColProperties, FormProperties } from ".";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";

interface FormData {
  [key: string]: any;
}

export default function () {
  const [form] = Form.useForm();
  const { componentList, currentDragComponent, commonDispatch } = useContext(
    Context
  );
  const { id } = currentDragComponent || {};

  const onValuesChange = (changedValues: any, allValues: FormData) => {
    console.log(allValues);
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          formItemProps: {
            ...allValues,
          },
        },
      },
    });
  };

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      {componentList.length && currentDragComponent?.id ? (
        <>
          {getProperties(currentDragComponent.componentKey)}
          {/* <RowProperties /> */}
          <ColProperties />
          <FormProperties />
          <CommonProperties />
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
      )}
    </Form>
  );
}
