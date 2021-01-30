import React, { useContext, useEffect } from "react";
import { Form } from "antd";
import { Context } from "../stores/context";
import { key2Component } from "../constants";
import { FormComProp } from "../stores/typings";
import {
  INSERT_COMPONENT_LIST,
  SET_COMPONENT_LIST,
  SET_FLAG,
} from "../stores/action-type";
import { ReactSortable } from "react-sortablejs";
import { guid } from "../utils";

let update = false; // FIX: 控件焦点和拖拽的冲突
export default function () {
  const { componentList, commonDispatch } = useContext(Context);

  const Component = (prop: FormComProp) => {
    const { componentKey, formItemProp = {}, componentProp = {} } = prop;
    return (
      <Form.Item {...formItemProp}>
        {React.cloneElement(
          (
            <div className="component-warp">
              {key2Component[componentKey]?.component}
            </div>
          ) || <></>,
          componentProp
        )}
      </Form.Item>
    );
  };

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      <ReactSortable
        sort
        style={{
          height: '100%'
        }}
        group={{
          name: "editor-area",
          put: true,
        }}
        list={componentList}
        chosenClass="sortable-chosen"
        animation={200}
        delayOnTouchOnly
        setList={(newState) => {
          if (!update) {
            const params = newState?.map((item: any) => {
              if (item?.value) {
                return {
                  id: guid(),
                  componentKey: item.value,
                  formItemProp: {},
                  componentProp: {},
                };
              }
              return item
            });
            commonDispatch({
              type: SET_COMPONENT_LIST,
              payload: params,
            });
          }
        }}
        onChoose={() => {
          update = true;
        }}
        onStart={() => {
          update = false;
        }}
      >
        {componentList.map((item) => {
          return (
            <div key={item.id}>
              <Component
                id={item.id}
                key={item.id}
                formItemProp={item.formItemProp}
                componentProp={item.componentProp}
                componentKey={item.componentKey}
              />
            </div>
          );
        })}
      </ReactSortable>
    </div>
  );
}
