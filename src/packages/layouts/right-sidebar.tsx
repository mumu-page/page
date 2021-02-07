import React, { useContext, useEffect } from "react";
import { Tabs } from "antd";
import { FormProperties, ComponentProperties } from "../properties";
import { Context } from "../stores/context";
import { SET_CURRENT_DRAG_COMPONENT } from "../stores/action-type";

const { TabPane } = Tabs;
export default function () {
  const { componentList, commonDispatch } = useContext(Context);

  useEffect(() => {
    // 如果控件列表没有被选中的，则清空当前选中控件
    const comList = componentList?.filter((item) => item.chosen);
    if (!comList.length) {
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id: "",
          componentKey: "",
          formItemProps: {},
          componentProps: {},
        },
      });
    }
  }, [componentList, commonDispatch]);

  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="组件属性" key="1">
        <div className="component-properties">
          <ComponentProperties />
        </div>
      </TabPane>
      <TabPane tab="表单属性" key="2">
        <div className="form-properties">
          <FormProperties />
        </div>
      </TabPane>
    </Tabs>
  );
}
