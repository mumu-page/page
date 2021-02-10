import React, { useContext } from "react";
import { Context } from "../../stores/context";
import { SortableList } from "../../components";
import "./index.scss";

export default () => {
  const { currentDragComponent, componentList, commonDispatch } = useContext(
    Context
  );
  return (
    <>
      <SortableList
        currentDragComponent={currentDragComponent}
        componentList={componentList}
        commonDispatch={commonDispatch}
      />
      {componentList.length === 0 && (
        <div className="not-found-info">从左侧拖入或点选组件进行表单设计</div>
      )}
    </>
  );
};
