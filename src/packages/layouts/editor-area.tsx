import React, { memo, useContext } from "react";
import { Form } from "antd";
import { Context } from "../stores/context";
import { key2Component } from "../constants";
import { FormComProp } from "../stores/typings";
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
} from "../stores/action-type";
import { CommonState } from "../stores/typings";
import { ReactSortable } from "react-sortablejs";

let shouldUpdate = true; // FIX: 控件焦点和拖拽的冲突
function areEqual(prevProps: any, nextProps: any) {
  if (!shouldUpdate) {
    return true;
  }
  if (
    prevProps?.currentDragComponent?.id !== nextProps?.currentDragComponent?.id
  ) {
    return false;
  }
  if (prevProps.componentList === nextProps.componentList) {
    return true;
  }
  return false;
}
const EditorArea = memo((props: CommonState) => {
  const { currentDragComponent, componentList, commonDispatch } = props;

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
          if (shouldUpdate) {
            let params = newState.map((item) => {
              let ret = {
                ...item,
              };
              // console.log(currentDragComponent.id, item.id);
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
          shouldUpdate = false;
        }}
        onStart={(e) => {
          shouldUpdate = true;
        }}
        onAdd={(e) => {
          shouldUpdate = true;
        }}
        onUnchoose={(e) => {
          shouldUpdate = false
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

export default () => {
  const { currentDragComponent, componentList, commonDispatch } = useContext(
    Context
  );
  return (
    <EditorArea
      currentDragComponent={currentDragComponent}
      componentList={componentList}
      commonDispatch={commonDispatch}
    />
  );
};
