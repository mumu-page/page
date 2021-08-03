import { Checkbox, Tooltip } from "antd";
import React from "react";

interface CheckboxFieldType {
  tooltipTitle: string
  text: string
}
export default (props: CheckboxFieldType) => {
  const { tooltipTitle, text, ...fieldProps } = props

  return (
    <>
      <Checkbox {...fieldProps}>
        <Tooltip title={tooltipTitle}>{text}</Tooltip>
      </Checkbox>
    </>
  )
};
