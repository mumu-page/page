import React from "react";
import { Tabs } from "antd";
import { Properties } from "../properties";

const { TabPane } = Tabs;
export default function () {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="属性设置" key="1">
        <div className="form-properties">
          <Properties />
        </div>
      </TabPane>
    </Tabs>
  );
}
