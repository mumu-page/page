import React, { useCallback, useRef } from "react";
import { Form } from "antd";
import { useEffect } from "react";
import { ComponentItem, ContextMenu } from "..";
import {
  COPY_COMPONENT_LIST,
  DELETE_CURRENT_DRAG_COMPONENT,
  DEL_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
} from "../../stores/action-type";
import { commonDispatch, FormComProp } from "../../stores/typings";
import { findTarget, isDatePicker } from "../../utils/utils";
import { Target_ClassName } from "../../constants/constants";
import Menu from "../ContextMenu/Menu";
import {
  CopyOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./index.scss";
import eventBus from "../../utils/eventBus";
import { SHOW_SETTING_PANL } from "../../constants/events";
import * as uuid from "uuid";

interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[];
  currentDragComponent: FormComProp;
}

enum HANDLE_TYPE {
  copy = "复制这个",
  setting = "设置属性",
  del = "删除这个",
}

const options = [
  {
    key: "copy",
    icon: <CopyOutlined />,
    label: HANDLE_TYPE.copy,
  },
  {
    key: "setting",
    icon: <SettingOutlined />,
    label: HANDLE_TYPE.setting,
  },
  {
    key: "del",
    icon: <DeleteOutlined />,
    label: HANDLE_TYPE.del,
    type: "del",
  },
];

export default function Container(props: EditorAreaProps) {
  const { currentDragComponent, componentList, commonDispatch } = props;
  const [form] = Form.useForm();
  const contenxtMenu = useRef(null);
  const {
    componentProps,
    formItemProps,
    formProps = {},
    colProps = {},
    rowProps = {},
  } = currentDragComponent;

  const setMoveableOption = (id: string | number) => {
    const { elementGuidelines, target, frame } = findTarget(id, componentList);
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        frame,
        elementGuidelines,
        target,
      },
    });
  };

  const handleContextMenuClick = (key: string, label: string) => {
    if (label === HANDLE_TYPE.del) {
      commonDispatch({
        type: DEL_COMPONENT_LIST,
        payload: {
          id: currentDragComponent.id,
        },
      });
      commonDispatch({
        type: DELETE_CURRENT_DRAG_COMPONENT,
      });
      commonDispatch({
        type: SET_MOVEABLE_OPTIONS,
        payload: {
          target: null,
        },
      });
    }
    if (label === HANDLE_TYPE.setting) {
      eventBus.emit(SHOW_SETTING_PANL);
    }
    if (label === HANDLE_TYPE.copy) {
      const newId = uuid.v4();
      commonDispatch({
        type: COPY_COMPONENT_LIST,
        payload: {
          id: currentDragComponent.id,
          newId,
        },
      });
      requestAnimationFrame(() => {
        setMoveableOption(newId);
      });
    }
  };

  useEffect(() => {
    setMoveableOption(currentDragComponent.id);
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
      {/* Row Col 和 ReactiveMoveable 有冲突  */}
      <div>
        {componentList.map((item: any) => {
          const {
            id,
            children,
            componentKey,
            formItemProps,
            componentProps,
            colProps: selfColProps = {},
            layout = {},
          } = item;

          const { frame = { translate: [0, 0, 0] }, height, width } = layout;
          const { translate } = frame;
          const style = {
            display: "inline-block",
            transform: `translate(${translate[0]}px, ${translate[1]}px)`,
          } as any;

          const colNum = rowProps.colNum;
          if (width) {
            style.width = `${width}px`;
          } else if (colNum) {
            style.width = `calc(100% / ${colNum})`;
          } else {
            style.width = `100%`;
          }
          if (height) {
            style.height = `${height}px`;
          }

          return (
            <div
              key={id}
              style={style}
              className={Target_ClassName}
              data-id={id}
              onClick={(e) => {
                e.stopPropagation();
                commonDispatch({
                  type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
                  payload: { id },
                });
                // 无论dom元素如何变，componentList没有变
                setMoveableOption(id);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                commonDispatch({
                  type: SET_CURRENT_DRAG_COMPONENT_BY_COMPONENT_LIST,
                  payload: { id },
                });
                // 无论dom元素如何变，componentList没有变
                setMoveableOption(id);
                (contenxtMenu.current as any)?.show?.(e);
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
      </div>
      <ContextMenu ref={contenxtMenu}>
        <Menu options={options} onClick={handleContextMenuClick} />
      </ContextMenu>
    </Form>
  );
}
