import React, { useContext, forwardRef, useState } from "react";
import { Button, Col, Row } from "antd";
import { IconFont, options } from "../constants";
import { Context } from "../stores/context";
import {
  PUT_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  SET_FLAG,
  SET_SHOW_NOT_FOUNT,
} from "../stores/action-type";
import { ReactSortable } from "react-sortablejs";
import * as uuid from "uuid";

const getNewOptions = (data: any[]) => {
  return data.map((item) => {
    return {
      ...item,
      children: item?.children?.map((cItem: any) => {
        const { value, label, icon } = cItem || {};
        const id = uuid.v4()
        return {
          value,
          label,
          icon,
          id,
          componentKey: value,
          formItemProp: {
            name: id
          },
          componentProp: {},
        };
      }),
    };
  });
}

const CustomRow = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <Row ref={ref} gutter={[6, 6]} style={{ padding: "0 12px 12px 12px" }}>
      {props.children}
    </Row>
  );
});

const initOptions = getNewOptions(options)
export default () => {
  const { currentDragComponent, flag, commonDispatch } = useContext(Context);
  const [_options, setOptions] = useState(initOptions)

  const generator = (data: any[]) => {
    return data.map((item) => {
      return (
        <div
          key={item.key}
          onDragEnter={(e) => {
            if (flag) {
              commonDispatch({ type: SET_FLAG, payload: false });
            }
          }}
        >
          <Button
            className="title-btn"
            style={{ paddingLeft: 12 }}
            icon={<IconFont type={item.icon} />}
            type="text"
            size="large"
            disabled
          >
            {item.label}
          </Button>
          <ReactSortable
            group={{
              name: "editor-area",
              pull: "clone",
              put: false,
              revertClone: true
            }}
            sort={false}
            tag={CustomRow}
            list={item.children}
            setList={(newState) => { }}
            animation={200}
            delayOnTouchOnly
            onEnd={() => {
              // 仅仅在初始化时生效
              if (flag) {
                commonDispatch({
                  type: PUT_COMPONENT_LIST,
                  payload: {
                    ...currentDragComponent,
                    chosen: true
                  },
                });
                commonDispatch({ type: SET_FLAG, payload: false });
                commonDispatch({
                  type: SET_SHOW_NOT_FOUNT,
                  payload: false,
                });
              }
              setOptions(getNewOptions(_options))
            }}
          >
            {item.children &&
              item.children.map((childItem: any) => {
                return (
                  <Col span={12} key={childItem.value}>
                    <Button
                      block
                      type="default"
                      onDragStart={() => {
                        let params = {
                          ...childItem,
                        };
                        commonDispatch({
                          type: SET_CURRENT_DRAG_COMPONENT,
                          payload: params,
                        });
                      }}
                      draggable
                      icon={<IconFont type={childItem.icon} />}
                    >
                      {childItem.label}
                    </Button>
                  </Col>
                );
              })}
          </ReactSortable>
        </div>
      );
    });
  };

  return <>{generator(_options)}</>;
};
