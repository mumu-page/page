import React from "react";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { ComponentItem } from "..";
import {
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
} from "../../stores/action-type";
import { commonDispatch, FormComProp } from "../../stores/typings";
import { isDatePicker } from "../../utils/utils";
import "./index.scss";
import { Target_ClassName } from "../../constants/constants";

interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[];
  currentDragComponent: FormComProp;
}

export default function Container(props: EditorAreaProps) {
  const { currentDragComponent, componentList, commonDispatch } = props;
  const [form] = Form.useForm();
  const {
    componentProps,
    formItemProps,
    formProps = {},
  } = currentDragComponent;

  const findTarget = (
    id = currentDragComponent.id,
    selectors = `.${Target_ClassName}`,
    list = componentList
  ) => {
    let divList = [].slice.call(document.querySelectorAll(selectors) as any);
    const target = divList.filter((item: any) => {
      return item?.getAttribute?.("data-id") === id;
    })?.[0];
    const frame = list?.filter((item) => {
      return item.id === id;
    })?.[0]?.layout?.frame;

    // 将当前元素从divList中移除, 当前元素不再作为参考辅助线
    divList = divList.filter((item: any) => {
      return item?.getAttribute?.("data-id") !== id;
    });
    return {
      divList,
      target,
      frame,
    };
  };

  const setMoveableOption = (id?: string | number | undefined) => {
    const { divList, target, frame } = findTarget(id);
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        frame,
        elementGuidelines: divList,
        target,
      },
    });
  };

  useEffect(() => {
    setMoveableOption();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      [formItemProps.name]: componentProps?.defaultValue,
    });
  }, [currentDragComponent, form]);

  useEffect(() => {
    const _initialValues = {} as any;
    componentList.forEach((item) => {
      const { componentKey, formItemProps, componentProps } = item;
      const { name } = formItemProps || {};
      const { defaultValue } = componentProps || {};
      if (!isDatePicker(componentKey)) {
        _initialValues[name] = defaultValue;
      }
    });
    form.setFieldsValue(_initialValues);
  }, [componentList, form]);

  return (
    <Form
      {...formProps}
      style={{
        height: "100%",
        position: "relative",
      }}
      form={form}
    >
      {componentList.map((item: any) => {
        const {
          id,
          children,
          componentKey,
          formItemProps,
          componentProps,
          colProps = {},
          rowProps = {},
          layout = {},
        } = item;

        const { frame = { translate: [0, 0, 0] }, height, width } = layout;
        const { translate } = frame;
        const style = {
          transform: `translate(${translate[0]}px, ${translate[1]}px)`,
        } as any;

        if (width) {
          style.width = `${width}px`;
        }
        if (height) {
          style.height = `${height}px`;
        }

        return (
          <div
            {...colProps}
            key={item.id}
            style={style}
            className={Target_ClassName}
            data-id={item.id}
            onClick={() => {
              commonDispatch({
                type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
                payload: { id },
              });
              // 无论dom元素如何变，componentList没有变
              setMoveableOption(item.id);
            }}
          >
            <ComponentItem
              id={id}
              key={id}
              form={form}
              children={children}
              colProps={colProps}
              rowProps={rowProps}
              formItemProps={formItemProps}
              componentProps={componentProps}
              componentKey={componentKey}
            />
          </div>
        );
      })}
    </Form>
  );
}
