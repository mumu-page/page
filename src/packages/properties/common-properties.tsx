import React, { useEffect, useContext, useRef, useCallback } from "react";
import { Divider, Form, Input, Slider } from "antd";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { isDatePickerRange } from "../utils/utils";
import { PLACEHOLDER_ENUM } from "../constants";
import { debounce } from "lodash";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";

interface FormData {
  componentWidth: string;
  placeholder: string | string[];
}
/**
 * 组件的公共属性设置
 */
export default function () {
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
  const onValuesChange = debounce(
    useCallback(
      (changedValues: any, allValues: FormData) => {
        // 如果是日期范围类控件，设置placeholder为数组
        if (isDatePickerRange(currentDragComponent?.componentKey)) {
          allValues.placeholder = placeholderRef.current;
        }
        const { placeholder, componentWidth } = allValues;
        const style = {
          width: componentWidth + "%",
        };
        commonDispatch({
          type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
          payload: {
            data: {
              componentProps: {
                placeholder,
                style,
              },
            },
          },
        });

        // 如果是设置的组件宽度，更新当前控件
        if (changedValues?.componentWidth) {
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: {
              id,
              componentProps: {
                placeholder,
                style,
              },
            },
          });
        }
      },
      [commonDispatch, currentDragComponent?.componentKey, id]
    )
  );

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
      componentWidth: style?.width?.replace("%", "") || 100,
    });
  }, [componentProps, currentDragComponent, form]);

  return (
    <>
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>
        通用属性
      </Divider>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        form={form}
        initialValues={{ componentWidth: 100 }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="组件宽度" name="componentWidth">
          <Slider
            marks={{ 0: "0%", 50: "50%", 100: "100%" }}
            min={0}
            max={100}
            tipFormatter={(val) => val + "%"}
          />
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
      </Form>
    </>
  );
}
