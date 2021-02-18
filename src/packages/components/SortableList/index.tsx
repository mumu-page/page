import React, { memo, useEffect } from "react";
import { Col, Form, Row } from "antd";
import { FormComProp, commonDispatch } from "../../stores/typings";
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
} from "../../stores/action-type";
import { ReactSortable } from "react-sortablejs";
import { GLOBAL_STATE } from "../../stores/state";
import SortableItem from "../SortableItem";
import { isDatePicker } from "../../utils/utils";
import { canChosen, canAddCol } from "../../layouts/EditorArea/data";
import { areEqualList } from "../../layouts/EditorArea/utils";

interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[];
  currentDragComponent: FormComProp;
}
export default memo((props: EditorAreaProps) => {
  const { currentDragComponent, componentList, commonDispatch } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    const { componentProps, formItemProps } = currentDragComponent;
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
      style={{
        // height: "100%",
        position: "relative",
      }}
      form={form}
    >
      <ReactSortable
        sort
        className="sortable-list"
        style={{
          paddingBottom: componentList.length === 0 ? "30%" : "",
        }}
        group={{
          name: "editor-area",
          put: true,
        }}
        tag={Row}
        list={componentList}
        ghostClass="sortable-ghost"
        chosenClass="sortable-chosen"
        animation={200}
        fallbackTolerance={5}
        delayOnTouchOnly
        setList={(newState) => {
          if (canAddCol.value) {
            commonDispatch({
              type: SET_COMPONENT_LIST,
              payload: {
                currentId: GLOBAL_STATE?.currentDragComponent?.id,
                newState,
              },
            });
          }
        }}
        onAdd={(e) => {
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: GLOBAL_STATE.currentDragComponent,
          });
        }}
        onUnchoose={(e) => {
          if (!canChosen.value) return;
          // FIX: 修复已选中，再次选中则样式丢失
          e.item.classList.add("sortable-chosen");
          GLOBAL_STATE.currentDragComponent.id = e.item.dataset?.id || "";
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
            payload: { id: GLOBAL_STATE.currentDragComponent.id },
          });
        }}
        onUpdate={(_, sortable, store) => {
          console.log(_, sortable, store);
        }}
      >
        {componentList.map((item: any) => {
          const {
            id,
            children,
            componentKey,
            formItemProps,
            componentProps,
            colProps = {},
          } = item;

          return (
            <Col key={item.id} {...colProps} className="editor-area-item-col">
              <SortableItem
                id={id}
                key={id}
                form={form}
                children={children}
                colProps={colProps}
                formItemProps={formItemProps}
                componentProps={componentProps}
                componentKey={componentKey}
              />
            </Col>
          );
        })}
      </ReactSortable>
    </Form>
  );
}, areEqualList);
