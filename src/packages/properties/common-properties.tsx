import React, { useEffect, useContext, useRef, useCallback } from "react";
import { Divider, Form, Input, Slider } from "antd";
import { Context } from "../stores/context";
import { SET_CURRENT_DRAG_COMPONENT, UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG } from "../stores/action-type";
import { isDatePickerRange } from "../utils/utils";
import { PLACEHOLDER_ENUM } from "../constants";
import { debounce } from "lodash";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

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
    isDatePickerRange(componentKey) ? componentProps?.placeholder : ['', '']
  )
  const onValuesChange = useCallback(debounce((changedValues: any, allValues: FormData) => {
    if (isDatePickerRange(currentDragComponent?.componentKey)) {
      allValues.placeholder = placeholderRef.current
    }
    const { placeholder, componentWidth } = allValues
    const style = {
      width: componentWidth + '%'
    }
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          componentProps: {
            placeholder,
            style,
          },
        },
      },
    });
  }), [])

  const setPlaceholderRef = (index: number, value: any) => {
    try {
      placeholderRef.current[index] = value
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          id,
          data: {
            componentProps: {
              placeholder: placeholderRef.current,
            },
          },
        },
      });
    } catch (error) {
    }
  }

  const upCurrenDrag = (placeholder: any) => {
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        componentProps: {
          placeholder
        }
      },
    });
  }

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [componentProps, currentDragComponent, form]);

  return (
    <>
      <Divider style={{ padding: "0 20px", fontSize: "14px" }}>
        公共属性
      </Divider>
      <Form form={form} {...layout} initialValues={{ componentWidth: 100 }} onValuesChange={onValuesChange}>
        <Form.Item label="组件宽度" name="componentWidth">
          <Slider marks={{ 0: '0%', 50: "50%", 100: "100%" }} min={0} max={100} tipFormatter={val => val + '%'} />
        </Form.Item>
        <Form.Item label="占位提示" name="placeholder">
          {
            isDatePickerRange(currentDragComponent?.componentKey) ? <Input.Group compact>
              <Input
                value={placeholderRef.current[0]}
                defaultValue={PLACEHOLDER_ENUM[currentDragComponent.componentKey][0]}
                style={{ width: '50%' }}
                onBlur={() => upCurrenDrag(placeholderRef?.current)}
                onPressEnter={() => upCurrenDrag(placeholderRef?.current)}
                onInput={(e: any) => {
                  const value = e.target.value;
                  setPlaceholderRef(0, value)
                }} />
              <Input
                value={placeholderRef.current[1]}
                defaultValue={PLACEHOLDER_ENUM[currentDragComponent.componentKey][1]}
                style={{ width: '50%' }}
                onBlur={upCurrenDrag}
                onPressEnter={upCurrenDrag}
                onInput={(e: any) => {
                  const value = e.target.value;
                  setPlaceholderRef(1, value)
                }} />
            </Input.Group> : <Input
                onBlur={e => upCurrenDrag(e.target.value)}
                onPressEnter={(e: any) => upCurrenDrag(e.target.value)}
              />
          }
        </Form.Item>
      </Form>
    </>
  );
}
