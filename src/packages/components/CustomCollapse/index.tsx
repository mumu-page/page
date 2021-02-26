import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import React from "react";
import "./index.scss";

interface CustomCollapseType {
  defaultActiveKey: string[];
  children: React.ReactNode;
}
const CustomCollapse = (props: CustomCollapseType) => {
  const { defaultActiveKey } = props;

  return (
    <Collapse
      defaultActiveKey={defaultActiveKey}
      className="site-collapse-custom-collapse"
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      {props.children}
    </Collapse>
  );
};

interface CustomPanelType {
  header: string;
  key: string;
  children: React.ReactNode;
}
CustomCollapse.Panel = (props: CustomPanelType) => {
  const { header, key } = props;

  return (
    <Collapse.Panel
      header={header}
      key={key}
      className="site-collapse-custom-panel"
    >
      {props.children}
    </Collapse.Panel>
  );
};

export default CustomCollapse;
