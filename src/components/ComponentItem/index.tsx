import React from "react";
import { Form } from "antd";
import { FormComProp } from "../../stores/typings";
import { isCheck, isDatePicker, isRenderFormItem } from "../../utils/utils";
import { ICONS, getComponent } from "../../constants";
import * as moment from "moment";

// 控件设计时默认不能交互
const disableCom = {
  readOnly: true,
  popupVisible: false,
  open: false,
};

export default (prop: FormComProp) => {
  const {
    id,
    children,
    componentKey,
    formItemProps = {},
    componentProps = {},
    rowProps = {},
    form,
    style,
  } = prop;

  // 1.如果是日期类控件，但值不是moment类型，清除值
  // 2.如果是级联控件，清除值
  if (
    (isDatePicker(componentKey) &&
      !moment.isMoment(form?.getFieldValue(formItemProps.name))) ||
    ["Cascader"].includes(componentKey)
  ) {
    form?.setFieldsValue({
      [formItemProps.name]: "",
    });
  }

  const { defaultValue, ...componentOtherProps } = componentProps;
  // 输入框前后图标处理
  const componentPropsKey = Object.keys(componentOtherProps);
  if (["Input"].includes(componentKey)) {
    if (componentPropsKey.includes("prefix")) {
      const IconComponent =
        (ICONS as any)[componentOtherProps["prefix"]] || React.Fragment;
      componentOtherProps["prefix"] = <IconComponent />;
    }
    if (componentPropsKey.includes("suffix")) {
      const IconComponent =
        (ICONS as any)[componentOtherProps["suffix"]] || React.Fragment;
      componentOtherProps["suffix"] = <IconComponent />;
    }
  }

  return isRenderFormItem(componentKey) ? (
    <Form.Item
      {...formItemProps}
      style={style}
      valuePropName={isCheck(componentKey) ? "checked" : "value"}
    >
      {React.cloneElement(getComponent(componentKey) || <></>, {
        disabled: componentKey === "Rate",
        ...disableCom,
        ...componentOtherProps,
      })}
    </Form.Item>
  ) : (
    React.cloneElement(getComponent(componentKey) || <></>, {
      id,
      children,
      rowProps,
      ...componentOtherProps,
    })
  );
};
