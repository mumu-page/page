import { Col, Form, Row } from "antd";
import React from "react";
import { useEffect } from "react";
import Moveable from "react-moveable";
import { ComponentItem, ReactiveMoveable } from "..";
import {
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
} from "../../stores/action-type";
import { commonDispatch, FormComProp } from "../../stores/typings";
import { isDatePicker } from "../../utils/utils";
import "./index.scss";

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
    selectors = ".editor-area-item-col",
    list = componentList
  ) => {
    const divList = [].slice.call(document.querySelectorAll(selectors)) as any;
    const target = {} as any;
    list?.forEach((item, index) => {
      if (item.id === id) {
        target.item = item;
        target.index = index;
      }
    });
    return {
      divList,
      target,
    };
  };

  const setTargetData = (id?: string | number | undefined) => {
    const { divList, target } = findTarget(id);
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        translate: [0, 0],
        elementGuidelines: divList,
        target: divList[target?.index],
      },
    });
  };

  useEffect(() => {
    setTargetData();
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
      <Row>
        {componentList.map((item: any) => {
          const {
            id,
            children,
            componentKey,
            formItemProps,
            componentProps,
            colProps = {},
            rowProps = {},
          } = item;

          return (
            <Col
              key={item.id}
              {...colProps}
              className="editor-area-item-col"
              onClick={() => {
                commonDispatch({
                  type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
                  payload: { id },
                });
                setTargetData(item.id);
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
            </Col>
          );
        })}
      </Row>
    </Form>
  );
}
