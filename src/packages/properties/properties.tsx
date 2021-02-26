import React, { useContext } from "react";
import { Empty, Typography } from "antd";
import { getProperties } from "../constants";
import { Context } from "../stores/context";
import { CommonProperties, RowProperties, FormProperties } from ".";

const Title = (props: { text: string }) => {
  return (
    <Typography.Title level={5}>
      <Typography.Text type="secondary" style={{ paddingLeft: 10 }}>
        {props.text}
      </Typography.Text>
    </Typography.Title>
  );
};

export default function () {
  const { componentList, currentDragComponent } = useContext(Context);

  return (
    <>
      {componentList.length && currentDragComponent?.id ? (
        <>
          <Title text="控件" />
          {getProperties(currentDragComponent.componentKey)}
          <Title text="布局" />
          <RowProperties />
          <Title text="表单" />
          <FormProperties />
          <Title text="通用" />
          <CommonProperties />
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
      )}
    </>
  );
}
