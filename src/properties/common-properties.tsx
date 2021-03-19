import React, { useEffect, useContext, memo, useCallback } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { isDatePickerRange } from "../utils/utils";
import { options } from "../constants";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { ComponentKeys } from "../stores/typings";
import CheckboxField from "../components/FormFields/CheckboxField";
import { CustomCollapse, Title } from "../components";
import { debounce } from "lodash";

const { Option, OptGroup } = Select;

interface FormData {
  componentKey: ComponentKeys;
  componentWidth: string;
  bordered: boolean;
  placeholder: string | string[];
  [key: string]: any;
}

/**
 * 组件的公共属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, componentProps = {} } = currentDragComponent || {};

  const onValuesChange = useCallback(
    debounce(
      (
        { componentWidth: cw, placeholder: p, placeholder1, placeholder2 }: any,
        allValues: FormData
      ) => {
        const { componentKey } = allValues;
        // 如果是日期范围类控件，设置placeholder为数组
        if (isDatePickerRange(currentDragComponent?.componentKey)) {
          allValues.placeholder = [
            allValues.placeholder1,
            allValues.placeholder2,
          ];
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
      },
      500
    ),
    []
  );

  useEffect(() => {
    const { style = {}, placeholder, ...other } = componentProps || {};
    const width = style?.width?.replace("%", "")?.replace(/null|undefined/, "");
    let placeholder1;
    let placeholder2;
    if (Array.isArray(placeholder)) {
      placeholder1 = placeholder[0];
      placeholder2 = placeholder[1];
    }
    form.resetFields();
    form.setFieldsValue({
      ...other,
      componentKey: currentDragComponent.componentKey,
      componentWidth: width,
      placeholder,
      placeholder1,
      placeholder2,
    });
  }, [currentDragComponent]);

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Title text="通用" />
        <CustomCollapse defaultActiveKey={["控件类型"]}>
          <CustomCollapse.Panel header="控件类型" key="控件类型">
            <Form.Item label="" name="componentKey">
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
          </CustomCollapse.Panel>
          <CustomCollapse.Panel
            header={
              <Form.Item
                label="控件宽度"
                name="componentWidth"
                tooltip="请输入百分比"
                className="mb-0"
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            }
          >
            <Form.Item label="" valuePropName="checked" name="bordered">
              <CheckboxField tooltipTitle="是否有边框" text="显示边框" />
            </Form.Item>
          </CustomCollapse.Panel>
          <CustomCollapse.Panel header="占位提示" key="占位提示">
            {isDatePickerRange(currentDragComponent?.componentKey) ? (
              <>
                <Form.Item label="" name="placeholder1">
                  <Input />
                </Form.Item>
                <Form.Item label="" name="placeholder2">
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item label="" name="placeholder">
                <Input />
              </Form.Item>
            )}
          </CustomCollapse.Panel>
        </CustomCollapse>
      </Form>
    </>
  );
});
