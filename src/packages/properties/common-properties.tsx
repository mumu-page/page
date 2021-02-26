import React, { useEffect, useContext, useRef, useCallback, memo } from "react";
import { Collapse, Form, Input, InputNumber, Select } from "antd";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { isDatePickerRange } from "../utils/utils";
import { PLACEHOLDER_ENUM, options } from "../constants";
import { debounce } from "lodash";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { ComponentKeys } from "../stores/typings";
import { CaretRightOutlined } from "@ant-design/icons";
import CheckboxField from "../components/FormFields/CheckboxField";

const { Option, OptGroup } = Select;

interface FormData {
  componentKey: ComponentKeys;
  componentWidth: string;
  bordered: boolean;
  placeholder: string | string[];
}
let shouldUpdate = true;

/**
 * 组件的公共属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {}, componentKey } = currentDragComponent || {};

  const placeholderRef = useRef(
    isDatePickerRange(componentKey)
      ? Array.isArray(componentProps?.placeholder)
        ? componentProps?.placeholder
        : ["", ""]
      : ["", ""]
  );
  const onValuesChange = (changedValues: any, allValues: FormData) => {
    const { componentKey } = allValues;
    // 如果是日期范围类控件，设置placeholder为数组
    if (isDatePickerRange(currentDragComponent?.componentKey)) {
      allValues.placeholder = placeholderRef.current;
    }
    const { placeholder, componentWidth, bordered } = allValues;
    const style = {
      width: componentWidth + "%",
    };
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        data: {
          componentKey,
          componentProps: {
            placeholder,
            style,
            bordered,
          },
        },
      },
    });

    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          placeholder,
          style,
          bordered,
        },
      },
    });
  };

  const setPlaceholderRef = (index: number, value: any) => {
    try {
      placeholderRef.current[index] = value;
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          data: {
            componentProps: {
              placeholder: placeholderRef.current,
            },
          },
        },
      });
    } catch (error) {}
  };

  const upCurrenDrag = (placeholder: any) => {
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          placeholder,
        },
      },
    });
  };

  useEffect(() => {
    const { style } = componentProps || {};
    form.resetFields();
    form.setFieldsValue({
      ...componentProps,
      componentKey: currentDragComponent.componentKey,
      componentWidth: style?.width?.replace("%", "") || 100,
    });
  }, [componentProps, currentDragComponent, form]);

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        form={form}
        initialValues={{ componentWidth: 100 }}
        onValuesChange={onValuesChange}
      >
        <Collapse
          // defaultActiveKey={["通用属性"]}
          className="site-collapse-custom-collapse"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Collapse.Panel
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
          </Collapse.Panel>
          <Collapse.Panel
            header="通用属性"
            key="通用属性"
            className="site-collapse-custom-panel"
          >
            <Form.Item label="组件宽度" name="componentWidth">
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item label="占位提示" name="placeholder">
              {isDatePickerRange(currentDragComponent?.componentKey) ? (
                <Input.Group compact>
                  <Input
                    value={placeholderRef.current && placeholderRef.current[0]}
                    defaultValue={
                      PLACEHOLDER_ENUM[currentDragComponent.componentKey] &&
                      PLACEHOLDER_ENUM[currentDragComponent.componentKey][0]
                    }
                    style={{ width: "50%" }}
                    onBlur={() => upCurrenDrag(placeholderRef?.current)}
                    onPressEnter={() => upCurrenDrag(placeholderRef?.current)}
                    onInput={(e: any) => {
                      const value = e.target.value;
                      setPlaceholderRef(0, value);
                    }}
                  />
                  <Input
                    value={placeholderRef.current && placeholderRef.current[1]}
                    defaultValue={
                      PLACEHOLDER_ENUM[currentDragComponent.componentKey] &&
                      PLACEHOLDER_ENUM[currentDragComponent.componentKey][1]
                    }
                    style={{ width: "50%" }}
                    onBlur={upCurrenDrag}
                    onPressEnter={upCurrenDrag}
                    onInput={(e: any) => {
                      const value = e.target.value;
                      setPlaceholderRef(1, value);
                    }}
                  />
                </Input.Group>
              ) : (
                <Input
                  onBlur={(e) => upCurrenDrag(e.target.value)}
                  onPressEnter={(e: any) => upCurrenDrag(e.target.value)}
                />
              )}
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="bordered">
              <CheckboxField tooltipTitle="是否有边框" text="显示边框" />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  );
});
