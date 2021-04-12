import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, Select, InputNumber, Typography, Switch } from "antd";
import { Context } from "../stores/context";
import { RESET_COMPONENT_LAYOUT, SET_TARGET } from "../stores/action-type";
import { FORM_PROPERTIES_OPTIONS } from "../constants/constants";
import CheckboxField from "../components/FormFields/CheckboxField";
import { refreshTarget } from "../utils/utils";
import { CustomCollapse, Title } from "../components";
import { debounce, merge } from "lodash";

// 默认全局布局
function genLayout(colNum: 1 | 2 | 3 | 4, row = 24) {
  if (isNaN(Number(colNum))) {
    colNum = 1;
  }
  const col = Math.floor(Number(row / colNum));
  return {
    xs: col,
    sm: col,
    md: col,
    lg: col,
    xl: col,
    xxl: col,
  };
}

/**
 * 布局增加精简模式和复杂模式
 * 精简模式：支持设置 几列布局等 比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */
export default function () {
  const [form] = Form.useForm();
  const {
    target: currentDragComponent,
    moveableOptions,
    commonDispatch,
  } = useContext(Context);
  const { id, rowProps = {} } = currentDragComponent || {};
  const { target } = moveableOptions || {};
  const [mode, setMode] = useState<"专业模式" | "精简模式">("精简模式");

  const onValuesChange = useCallback(
    debounce((changedValues: any, allValues: any) => {
      let newAllValues = allValues;
      if (mode === "精简模式") {
        newAllValues = merge(allValues, genLayout(allValues.colNum));
        // 重置layout属性
        commonDispatch({
          type: RESET_COMPONENT_LAYOUT,
        });
      }
      // 更新当前组件
      commonDispatch({
        type: SET_TARGET,
        payload: {
          id,
          rowProps: newAllValues,
        },
      });
      // 重新获取当前选中元素
      refreshTarget(target, commonDispatch);

      updateLayout()
    }, 200),
    [currentDragComponent.id, mode]
  );

  const updateLayout = () => {
    const viewport = (document.querySelector(".viewport") as HTMLElement) || {};
    const formRow = (document.querySelector(".form-row") as HTMLElement) || {};
    const { width, height } = formRow?.getBoundingClientRect?.() || {};
    console.log(width, height);
    
    viewport.style.width = width + "px";
    viewport.style.height = height + "px";
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(rowProps);
  }, [currentDragComponent?.id]);

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
              setMode(mode === "精简模式" ? "专业模式" : "精简模式");
            }}
          >
            <Switch
              checkedChildren="专业模式"
              unCheckedChildren="精简模式"
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
          <Form.Item label="垂直对齐" name="align">
            <Select>
              <Select.Option value="top">靠上</Select.Option>
              <Select.Option value="middle">居中</Select.Option>
              <Select.Option value="bottom">靠下</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="水平排列" name="justify">
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
          {mode === "精简模式" && (
            <>
              <Form.Item label="列数" name="colNum">
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
                name="span"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="xs"
                label="屏幕 < 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="sm"
                label="屏幕 ≥ 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="md"
                label="屏幕 ≥ 768px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="lg"
                label="屏幕 ≥ 992px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="xl"
                label="屏幕 ≥ 1200px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="xxl"
                label="屏幕 ≥ 1600px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            </>
          )}
          <Form.Item label="栅格间隔" name="gutter" labelCol={{ span: 17 }}>
            <InputNumber className="w-100" min={0} max={100} />
          </Form.Item>
          <Form.Item label="" name="wrap" valuePropName="checked">
            <CheckboxField tooltipTitle="是否自动换行" text="自动换行" />
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  );
}
