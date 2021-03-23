import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, Select, InputNumber, Typography, Switch } from "antd";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  SET_MOVEABLE_OPTIONS,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import { decodeKey, encodeKey, findTarget, refreshTarget } from "../utils/utils";
import { CustomCollapse, Title } from "../components";
import { debounce } from "lodash";

const localKey = [
  "single.colNum",
  "single.span",
  "single.xs",
  "single.md",
  "single.lg",
  "single.xl",
  "single.xxl",
];
/**
 * 是否是局部/全局布局
 */
function hasKey(changedValues: { [key: string]: any }, keys: string[]) {
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in changedValues) {
      return true;
    }
  }
  return false;
}

/**
 * 布局增加简洁模式和复杂模式
 * 简洁模式：支持设置 几列布局等 比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */
export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, moveableOptions, commonDispatch } = useContext(
    Context
  );
  const { id, colProps = {}, rowProps = {} } = currentDragComponent || {};
  const { target } = moveableOptions || {};
  const [mode, setMode] = useState<"专业模式" | "简洁模式">("简洁模式");

  const onValuesChange = useCallback(
    debounce((changedValues: any, allValues: any) => {
      const newAllValues = decodeKey(allValues, ["all", "single"]);
      // 更新局部组件
      if (hasKey(changedValues, localKey)) {
        commonDispatch({
          type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
          payload: {
            id,
            data: {
              colProps: newAllValues.single,
            },
          },
        });
      }
      // 更新当前组件
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          colProps: newAllValues.single,
          rowProps: newAllValues.all,
        },
      });
      // 重新获取当前选中元素
      refreshTarget(target, commonDispatch);
    }, 500),
    [currentDragComponent.id, mode]
  );

  useEffect(() => {
    const values = encodeKey(
      {
        key: "all",
        data: rowProps,
      },
      {
        key: "single",
        data: colProps,
      }
    );
    form.resetFields();
    form.setFieldsValue(values);
  }, [currentDragComponent]);

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      initialValues={{}}
      onValuesChange={onValuesChange}
    >
      <Title
        text="布局"
        extra={
          <Typography.Link
            onClick={() => {
              setMode(mode === "简洁模式" ? "专业模式" : "简洁模式");
            }}
          >
            <Switch
              checkedChildren="专业模式"
              unCheckedChildren="简洁模式"
              checked={mode === "专业模式"}
            />
          </Typography.Link>
        }
      />
      <CustomCollapse defaultActiveKey={["栅格项"]}>
        <CustomCollapse.Panel
          header={
            mode === "专业模式" ? (
              <Form.Item
                label="栅格项"
                tooltip="屏幕 * 响应式栅格"
                labelCol={{ span: 16 }}
                name="single.span"
                className="mb-0"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            ) : (
              "栅格项"
            )
          }
          key="栅格项"
        >
          {mode === "简洁模式" && (
            <>
              <Form.Item label="占整行" name="single.span">
                <Select>
                  <Select.Option value={6}>四分之一</Select.Option>
                  <Select.Option value={8}>三分之一</Select.Option>
                  <Select.Option value={12}>一半</Select.Option>
                  <Select.Option value={24}>占满</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          {mode === "专业模式" && (
            <>
              <Form.Item
                name="single.xs"
                label="屏幕 < 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="single.sm"
                label="屏幕 ≥ 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="single.md"
                label="屏幕 ≥ 768px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="single.lg"
                label="屏幕 ≥ 992px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="single.xl"
                label="屏幕 ≥ 1200px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="single.xxl"
                label="屏幕 ≥ 1600px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            </>
          )}
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  );
}
