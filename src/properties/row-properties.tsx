import React, { useContext, useEffect, useState } from "react";
import { Form, Select, InputNumber, Typography, Switch } from "antd";
import { Context } from "../stores/context";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../stores/action-type";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import CheckboxField from "../components/FormFields/CheckboxField";
import { formatObject } from "../utils/utils";
import { CustomCollapse, Title } from "../components";

/**
 * 布局增加简洁模式和复杂模式
 * 简洁模式：支持设置 几列布局等 比较傻瓜式，比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */

export default function () {
  const [form] = Form.useForm();
  const { currentDragComponent, commonDispatch } = useContext(Context);
  const { id, colProps = {}, rowProps = {} } = currentDragComponent || {};
  const [mode, setMode] = useState<"专业模式" | "简洁模式">("简洁模式");

  const onValuesChange = (changedValues: any, allValues: any) => {
    const newAllValues = formatObject(allValues, ["all", "single"]);
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          colProps: newAllValues?.single,
        },
      },
    });
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        colProps: newAllValues?.single,
        rowProps: newAllValues?.all,
      },
    });
  };

  useEffect(() => {
    console.log(currentDragComponent);
    form.resetFields();
    form.setFieldsValue({
      ...colProps,
      ...rowProps,
    });
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
      <CustomCollapse defaultActiveKey={["整体布局"]}>
        <CustomCollapse.Panel
          header={
            <Form.Item
              label="整体布局"
              tooltip="在此设置的内容将应用于全部控件"
              className="mb-0"
            ></Form.Item>
          }
          key={"整体布局"}
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
                label="专属布局"
                tooltip="屏幕 * 响应式栅格"
                labelCol={{ span: 16 }}
                name="single.span"
                className="mb-0"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            ) : (
              "专属布局"
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
