import React, { memo, useContext } from "react";
import { Form, Button } from "antd";
import { FormComProp } from "../../stores/typings";
import { cloneDeep, debounce } from "lodash";
import {
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from "../../stores/action-type";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { isCheck, isDatePicker } from "../../utils/utils";
import { ICONS, key2Component } from "../../constants";
import * as moment from "moment";
import * as uuid from "uuid";
import { Context } from "../../stores/context";
import { canChosen } from "./data";
import { areEqualItem } from "./utils";

export default memo((prop: FormComProp) => {
  const {
    id,
    componentKey,
    formItemProps = {},
    componentProps = {},
    form,
  } = prop;
  const { componentList, commonDispatch } = useContext(Context);

  const handler = {} as any;
  // 1.如果是日期类控件，但值不是moment类型，清除值
  // 2.如果是级联控件，清除值
  if (
    (isDatePicker(componentKey) &&
      !moment.isMoment(form.getFieldValue(formItemProps.name))) ||
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

  return (
    <div key={id} className="component-warp">
      <div className="action-btn">
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<CopyOutlined />}
          onMouseLeave={() => {
            canChosen.set(true);
          }}
          onMouseEnter={() => {
            canChosen.set(false);
          }}
          onClick={() => {
            let current = {} as any;
            const newId = uuid.v4();
            componentList.forEach((item) => {
              if (item?.id === id) {
                current = cloneDeep(item);
              }
            });
            current.id = newId;
            current.key = newId;
            current.chosen = true;
            commonDispatch({
              type: SET_CURRENT_DRAG_COMPONENT,
              payload: current,
            });
            commonDispatch({
              type: PUT_COMPONENT_LIST,
              payload: current,
            });
          }}
        />
        <Button
          type="default"
          shape="circle"
          size="small"
          style={{ marginLeft: "5px" }}
          danger
          icon={<DeleteOutlined />}
          onMouseLeave={() => {
            canChosen.set(true);
          }}
          onMouseEnter={() => {
            canChosen.set(false);
          }}
          onClick={() => {
            commonDispatch({
              type: DEL_COMPONENT_LIST,
              payload: { id },
            });
          }}
        />
      </div>
      <Form.Item
        {...formItemProps}
        valuePropName={isCheck(componentKey) ? "checked" : "value"}
        style={{ marginBottom: 0 }}
      >
        {React.cloneElement(key2Component[componentKey]?.component || <></>, {
          ...componentOtherProps,
          ...handler,
        })}
      </Form.Item>
    </div>
  );
}, areEqualItem);
