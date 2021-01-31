import React, { memo, useContext } from "react";
import { Form } from "antd";
import { Context } from "../stores/context";
import { key2Component } from "../constants";
import { FormComProp } from "../stores/typings";
import {
  SET_COMPONENT_LIST,
  UPDATE_COMPONENT_LIST_CHOSEN,
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST,
} from "../stores/action-type";
import { ReactSortable } from "react-sortablejs";

function areEqual(prevProps: any, nextProps: any) {
  if (prevProps.componentList === nextProps.componentList) {
    return true;
  }
  return false;
}
let update = true; // FIX: 控件焦点和拖拽的冲突
export default memo(function (props: any) {
  const { currentDragComponent = {}, componentList, commonDispatch } = props;
  console.log('currentDragComponent', currentDragComponent)

  const Component = (prop: FormComProp) => {
    const { componentKey, formItemProp = {}, componentProp = {} } = prop;
    return (
      <Form.Item {...formItemProp} className="component-warp">
        {React.cloneElement(
          key2Component[componentKey]?.component || <></>,
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
          height: "100%",
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
          if (update) {
            let params = newState.map((item) => {
              let ret = {
                ...item,
              };
              console.log(currentDragComponent.id, item.id);
              if (currentDragComponent.id === item.id) {
                ret.chosen = true;
              } else {
                ret.chosen = false;
              }
              return ret;
            });
            commonDispatch({
              type: SET_COMPONENT_LIST,
              payload: params,
            });
          }
        }}
        onChoose={(e) => {
          update = false;
        }}
        onStart={(e) => {
          update = true;
        }}
        onAdd={(e) => {
          update = true;
          console.log("onAdd", e);
          console.log("onAdd", e.item.dataset.id);
        }}
        onUnchoose={(e) => {
          const allDIV = e.target.childNodes;
          allDIV.forEach((item: any) => {
            item.className = "";
          });
          e.item.className = "sortable-chosen";
          let currentDrag = {};
          componentList.forEach((item: any) => {
            if (e.item.dataset.id === item.id) {
              currentDrag = item;
            }
          });
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: currentDrag,
          });
        }}
      >
        {componentList.map((item: any) => {
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
}, areEqual);
