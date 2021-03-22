import React, { useContext } from "react";
import { getProperties } from "../constants";
import { Context } from "../stores/context";
import { CommonProperties, RowProperties, FormProperties } from ".";
import { Title } from "../components";

export default function () {
  const { componentList, currentDragComponent } = useContext(Context);

  const has = () => {
    return componentList.length && currentDragComponent?.id;
  };

  const TargetProperties = (
    <>
      <Title text="控件" />
      {getProperties(currentDragComponent.componentKey)}
    </>
  );

  return (
    <>
      {has() && TargetProperties}
      {has() && <FormProperties />}
      <CommonProperties />
    </>
  );
}
