import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, Select, InputNumber, Typography, Switch } from "antd";
import { Context } from "../stores/context";
import {
  RESET_COMPONENT_LAYOUT,
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  SET_MOVEABLE_OPTIONS,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import CheckboxField from "../components/FormFields/CheckboxField";
import { decodeKey, encodeKey, findTarget } from "../utils/utils";
import { CustomCollapse, Title } from "../components";
import { debounce, merge } from "lodash";

// 默认布局
function genLayout(colNum: 1 | 2 | 3 | 4, row = 24) {
  const col = Math.floor(Number(row / colNum));

  return {
    xs: col,
    sm: col,
    md: col,
    lg: col,
    xl: col,
    xxl: col,
    span: col,
  };
}

/**
 * 是否是局部更新
 */
function isLocal(changedValues: { [key: string]: any }) {
  const en = [
    "single.colNum",
    "single.xs",
    "single.md",
    "single.lg",
    "single.xl",
    "single.xxl",
  ];
  for (let i = 0; i < en.length; i++) {
    if (en[i] in changedValues) {
      return true;
    }
  }
  return false;
}

/**
 * 布局增加简洁模式和复杂模式
 * 简洁模式：支持设置 几列布局等 比较傻瓜式，比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */
export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, componentList, commonDispatch } = useContext(
    Context
  );
  const { id, colProps = {}, rowProps = {} } = currentDragComponent || {};
  const [mode, setMode] = useState<"专业模式" | "简洁模式">("简洁模式");

  const onValuesChange = useCallback(
    debounce((changedValues: any, allValues: any) => {
      const newAllValues = decodeKey(allValues, ["all", "single"]);
      if (changedValues["all.colNum"] && mode === "简洁模式") {
        newAllValues.all = merge(
          newAllValues.all,
          genLayout(changedValues["all.colNum"])
        );
        // 重置layout属性
        commonDispatch({
          type: RESET_COMPONENT_LAYOUT,
          payload: {
            colNum: newAllValues?.all?.colNum,
            gutter: newAllValues?.all?.gutter,
          },
        });
      }
      // 更新局部组件
      if (isLocal(changedValues)) {
        commonDispatch({
          type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
          payload: {
            id,
            data: {
              colProps: newAllValues?.single,
            },
          },
        });
      }
      // 更新当前组件
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          colProps: newAllValues?.single,
          rowProps: newAllValues?.all,
        },
      });
      // 重新获取当前选中元素
      requestAnimationFrame(() => {
        const { elementGuidelines, target, frame } = findTarget(
          currentDragComponent.id,
          componentList
        );
        commonDispatch({
          type: SET_MOVEABLE_OPTIONS,
          payload: {
            target: null, // immner会认为targer是同一个元素，所以不更新
          },
        });
        commonDispatch({
          type: SET_MOVEABLE_OPTIONS,
          payload: {
            elementGuidelines,
            target,
            frame,
          },
        });
      });
    }, 500),
    []
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
      initialValues={{
        align: "top",
        gutter: 0,
        justify: "start",
        wrap: true,
      }}
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
      <CustomCollapse defaultActiveKey={["全局布局"]}>
        <CustomCollapse.Panel
          header={
            <Form.Item
              label="全局布局"
              tooltip="在此设置的内容将应用于全部控件"
              className="mb-0"
            ></Form.Item>
          }
          key={"全局布局"}
        >
          <Form.Item label="垂直对齐" name="all.align">
            <Select>
              <Select.Option value="top">靠上</Select.Option>
              <Select.Option value="middle">居中</Select.Option>
              <Select.Option value="bottom">靠下</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="水平排列" name="all.justify">
            <Select>
              <Select.Option value="start">水平靠左分布</Select.Option>
              <Select.Option value="middle">水平靠右分布</Select.Option>
              <Select.Option value="center">水平居中分布</Select.Option>
              <Select.Option value="space-around">水平平均分布</Select.Option>
              <Select.Option value="space-between">
                水平两侧顶格分布
              </Select.Option>
            </Select>
          </Form.Item>
          {mode === "简洁模式" && (
            <>
              <Form.Item label="列数" name="all.colNum">
                <Select>
                  <Select.Option value="1">一列</Select.Option>
                  <Select.Option value="2">二列</Select.Option>
                  <Select.Option value="3">三列</Select.Option>
                  <Select.Option value="4">四列</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          {mode === "专业模式" && (
            <>
              <Form.Item
                label="屏幕 * 响应式栅格"
                labelCol={{ span: 17 }}
                name="all.span"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.xs"
                label="屏幕 < 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.sm"
                label="屏幕 ≥ 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.md"
                label="屏幕 ≥ 768px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.lg"
                label="屏幕 ≥ 992px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.xl"
                label="屏幕 ≥ 1200px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="all.xxl"
                label="屏幕 ≥ 1600px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            </>
          )}
          <Form.Item label="栅格间隔" name="all.gutter" labelCol={{ span: 17 }}>
            <InputNumber className="w-100" min={0} max={100} />
          </Form.Item>
          <Form.Item label="" name="all.wrap" valuePropName="checked">
            <CheckboxField tooltipTitle="是否自动换行" text="自动换行" />
          </Form.Item>
        </CustomCollapse.Panel>
        <CustomCollapse.Panel
          header={
            mode === "专业模式" ? (
              <Form.Item
                label="局部布局"
                tooltip="屏幕 * 响应式栅格"
                labelCol={{ span: 16 }}
                name="single.span"
                className="mb-0"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            ) : (
              "局部布局"
            )
          }
        >
          {mode === "简洁模式" && (
            <>
              <Form.Item label="占整行" name="single.colNum">
                <Select>
                  <Select.Option value="6">四分之一</Select.Option>
                  <Select.Option value="8">三分之一</Select.Option>
                  <Select.Option value="12">一半</Select.Option>
                  <Select.Option value="24">占满</Select.Option>
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
