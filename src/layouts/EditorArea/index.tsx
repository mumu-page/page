import React, { useContext } from "react";
import { Context } from "../../stores/context";
import { ComponentList } from "../../components";
import "./index.scss";

export default () => {
  const { currentDragComponent, componentList, commonDispatch } = useContext(
    Context
  );
  return (
    <>
      <ComponentList
        currentDragComponent={currentDragComponent}
        componentList={componentList}
        commonDispatch={commonDispatch}
      />
      {componentList.length === 0 && (
        // <div className="not-found-info">从左侧拖入或点选组件进行表单设计</div>
        <div className="not-found-info">从左侧点选组件进行表单设计</div>
      )}
    </>
  );
};
