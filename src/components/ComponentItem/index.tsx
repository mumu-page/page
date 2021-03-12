import React, { memo, useContext } from "react";
import { Form } from "antd";
import { FormComProp } from "../../stores/typings";
import { debounce } from "lodash";
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../../stores/action-type";
import { isCheck, isDatePicker, isRenderFormItem } from "../../utils/utils";
import { ICONS, getComponent } from "../../constants";
import * as moment from "moment";
import { Context } from "../../stores/context";
import { areEqualItem } from "../../layouts/EditorArea/utils";

export default memo((prop: FormComProp) => {
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
  const { commonDispatch } = useContext(Context);

  const handler = {} as any;
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
  if (["Select"].includes(componentKey)) {
    handler.onSelect = (value: any) => {
      console.log("value", value);
    };
  } else if (["Input", "Input.TextArea"].includes(componentKey)) {
    handler.onChange = debounce((e: any) => {
      const value = e?.target?.value;
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          componentProps: {
            defaultValue: value,
          },
        },
      });
    });
    const upList = (value: any) => {
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          data: {
            componentProps: {
              defaultValue: value,
            },
          },
        },
      });
    };
    handler.onPressEnter = (e: any) => {
      const value = e?.target?.value;
      upList(value);
    };
    handler.onBlur = (e: any) => {
      const value = e?.target?.value;
      console.log("onBlur");
      upList(value);
    };
  } else {
    handler.onChange = (value: any) => {
      console.log("value", value);
    };
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
        readOnly: true,
        popupVisible: false,
        open: false,
        ...componentOtherProps,
        ...handler,
      })}
    </Form.Item>
  ) : (
    React.cloneElement(getComponent(componentKey) || <></>, {
      ...componentOtherProps,
      ...handler,
      id,
      children,
      rowProps,
    })
  );
}, areEqualItem);
