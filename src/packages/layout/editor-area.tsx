import React, { useContext } from "react";
import { Form } from "antd";
import { Context } from "../stores/context";
import { key2Component } from "../constants";
import { FormComProp } from "../stores/typings";
import { SET_COMPONENT_LIST, SET_FLAG } from "../stores/action-type";
import { ReactSortable } from "react-sortablejs";

let update = false;
export default function () {
  const { flag, componentList, commonDispatch } = useContext(Context);

  const setFlag = (val: boolean) => {
    if (val && !flag) {
      commonDispatch({ type: SET_FLAG, payload: val });
    }
    if (!val && flag) {
      commonDispatch({ type: SET_FLAG, payload: val });
    }
  };

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
      onDragOver={(e) => {
        e.preventDefault();
        setFlag(true);
      }}
      onDrop={(e) => {
        setFlag(false);
      }}
    >
      <ReactSortable
        list={componentList}
        animation={200}
        delayOnTouchOnly
        setList={(newState) => {
          !update &&
            commonDispatch({
              type: SET_COMPONENT_LIST,
              payload: newState,
            });
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
      {/* {flag && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            setFlag(false);
          }}
          className="editor-area-flag"
          style={position}
        ></div>
      )} */}
    </div>
  );
}
