import React, { useContext, useEffect } from "react";
import { Form, Select, Empty, Collapse, Typography } from "antd";
import { options, getProperties } from "../constants";
import FormItemProperties from "./form-item-properties";
import { Context } from "../stores/context";
import { UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG } from "../stores/action-type";
import { ComponentKeys } from "../stores/typings";
import { isDatePicker } from "../utils/utils";
import { CommonProperties, /* RowProperties, */ ColProperties } from ".";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

interface FormData {
  componentKey: ComponentKeys;
}
export default function () {
  const [form] = Form.useForm<FormData>();
  const { componentList, currentDragComponent, commonDispatch } = useContext(
    Context
  );

  const onValuesChange = (changedValues: any, allValues: FormData) => {
    const { componentKey } = allValues;
    const newComponentProps = {} as any;
    if (isDatePicker(allValues.componentKey)) {
      newComponentProps.defaultValue = "";
    }
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_AND_CURRENT_DRAG,
      payload: {
        componentKey,
        newComponentProps,
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
      {componentList.length && currentDragComponent?.id ? (
        <>
          <Form
            {...FORM_PROPERTIES_OPTIONS}
            form={form}
            onValuesChange={onValuesChange}
          >
            <Typography.Title level={5}>
              <Typography.Text type="secondary" style={{ paddingLeft: 10 }}>
                属性
              </Typography.Text>
            </Typography.Title>
            <Collapse
              defaultActiveKey={["栅格数"]}
              className="site-collapse-custom-collapse"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel
                header="组件类型"
                key="组件类型"
                className="site-collapse-custom-panel"
              >
                <Form.Item label="组件类型" name="componentKey">
                  <Select>
                    {options.map((item) => {
                      return (
                        <OptGroup label={item.label} key={item.key}>
                          {Array.isArray(item.children) &&
                            item.children.map((childItem) => {
                              return (
                                <Option
                                  key={childItem.key}
                                  value={childItem.value}
                                >
                                  {childItem.label}
                                </Option>
                              );
                            })}
                        </OptGroup>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
          {/* <RowProperties /> */}
          <ColProperties />
          <FormItemProperties />
          <CommonProperties />
          {getProperties(currentDragComponent.componentKey)}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
      )}
    </>
  );
}
