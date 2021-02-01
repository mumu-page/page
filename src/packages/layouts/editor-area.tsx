import React, { memo, useContext } from "react";
import { Form, Button } from "antd";
import { Context } from "../stores/context";
import { globalState } from "../global/state";
import { key2Component } from "../constants";
import { FormComProp, commonDispatch } from "../stores/typings";
import {
  SET_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
} from "../stores/action-type";
import { ReactSortable } from "react-sortablejs";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";

let shouldUpdate = true; // FIX: 控件焦点和拖拽的冲突
let canChosen = true; // 能否选择，解决点击右上角按钮和列表选中的冲突
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
interface EditorAreaProps extends commonDispatch<object> {
  componentList: FormComProp[];
}
const EditorArea = memo((props: EditorAreaProps) => {
  const { componentList, commonDispatch } = props;
  const [form] = Form.useForm();

  const ComponentItem = (prop: FormComProp) => {
    const { componentKey, formItemProps = {}, componentProps = {} } = prop;
    return (
      <Form.Item {...formItemProps} className="component-warp">
        <>
          <div className="action-btn">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<CopyOutlined />}
              onMouseLeave={() => {
                console.log("onMouseLeave");
                canChosen = true;
              }}
              onMouseEnter={() => {
                console.log("onMouseEnter");
                canChosen = false;
              }}
              onClick={() => {}}
            />
            <Button
              type="default"
              shape="circle"
              size="small"
              style={{ marginLeft: "5px" }}
              danger
              icon={<DeleteOutlined />}
              onMouseLeave={() => {
                console.log("onMouseLeave");
                canChosen = true;
              }}
              onMouseEnter={() => {
                console.log("onMouseEnter");
                canChosen = false;
              }}
              onClick={() => {}}
            />
          </div>
          {React.cloneElement(
            key2Component[componentKey]?.component || <></>,
            componentProps
          )}
        </>
      </Form.Item>
    );
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("allValues", allValues);
  };

  return (
    <Form
      style={{
        height: "100%",
        position: "relative",
      }}
      onMouseLeave={() => {
        shouldUpdate = true;
      }}
      form={form}
      onValuesChange={onValuesChange}
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
        chosenClass="sortable-drag"
        animation={200}
        delayOnTouchOnly
        setList={(newState) => {
          if (shouldUpdate) {
            let params = newState.map((item) => {
              let ret = {
                ...item,
              };
              if (globalState?.currentDragComponent?.id === item.id) {
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
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: globalState?.currentDragComponent,
          });
        }}
        onUnchoose={(e) => {
          if (!canChosen) return;
          const allDIV = e.target.childNodes;
          allDIV.forEach((item: any) => {
            item.className = "";
          });
          e.item.className = "sortable-drag";
          commonDispatch({
            type: SET_CURRENT_DRAG_COMPONENT,
            payload: globalState?.currentDragComponent,
          });
        }}
      >
        {componentList.map((item: any) => {
          return (
            <div key={item.id}>
              <ComponentItem
                id={item.id}
                key={item.id}
                formItemProps={item.formItemProps}
                componentProps={item.componentProps}
                componentKey={item.componentKey}
              />
            </div>
          );
        })}
      </ReactSortable>
    </Form>
  );
}, areEqual);

export default () => {
  const { componentList, commonDispatch } = useContext(Context);
  return (
    <>
      <EditorArea
        componentList={componentList}
        commonDispatch={commonDispatch}
      />
      {componentList.length === 0 && (
        <div className="not-found-info">从左侧拖入或点选组件进行表单设计</div>
      )}
    </>
  );
};
