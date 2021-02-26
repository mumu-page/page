import { Checkbox, Tooltip } from "antd";
import React from "react";

interface CheckboxFieldType {
  tooltipTitle: string;
  text: string;
  onChange?: any;
}
export default (props: CheckboxFieldType) => {
  const { tooltipTitle, text, onChange } = props;

  return (
    <>
      <Checkbox onChange={onChange}>
        <Tooltip title={tooltipTitle}>{text}</Tooltip>
      </Checkbox>
    </>
  );
};
