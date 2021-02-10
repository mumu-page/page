import React from "react";
import * as Babel from "@babel/standalone";
import {
  Input,
  InputNumber,
  Select,
  Cascader,
  Radio,
  Checkbox,
  Switch,
  Slider,
  TimePicker,
  DatePicker,
  Rate,
  Upload,
  Row,
  Col,
  Button,
  Form,
} from "antd";
import { ICONS } from "../constants";

const context = {
  React,
  Form,
  Input,
  InputNumber,
  Select,
  Cascader,
  Radio,
  Checkbox,
  Switch,
  Slider,
  TimePicker,
  DatePicker,
  Rate,
  Upload,
  Row,
  Col,
  Button,
  ...ICONS,
};

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isSelect(componentKey: string) {
  return [
    "Select",
    "Cascader",
    "TimePicker",
    "TimePicker.RangePicker",
    "DatePicker",
    "DatePicker.RangePicker",
  ].includes(componentKey);
}

export function hasNotPlaceholder(componentKey: string) {
  return [
    "Radio",
    "Checkbox",
    "Switch",
    "Slider",
    "Rate",
    "Upload",
    "Row",
    "Button",
  ].includes(componentKey);
}

export function isDatePicker(componentKey: string) {
  return [
    "TimePicker",
    "TimePicker.RangePicker",
    "DatePicker",
    "DatePicker.RangePicker",
  ].includes(componentKey);
}

export function isRenderFormItem(componentKey: string) {
  return !["Col", "Button"].includes(componentKey);
}

export function isColComponent(componentKey: string) {
  return ["Col"].includes(componentKey);
}

export function isDatePickerRange(componentKey: string) {
  return ["TimePicker.RangePicker", "DatePicker.RangePicker"].includes(
    componentKey
  );
}

export async function string2Component(input?: string) {
  if (!input) return "";
  try {
    let output = Babel.transform(`<>${input}</>`, {
      presets: ["react", "es2015"],
    }).code;
    output = output?.replace('"use strict";', "").trim();
    // eslint-disable-next-line no-new-func
    const func = new Function(
      "context",
      `with(context){const ret = ${output};return ret;}`
    );
    return func(context);
  } catch (e) {
    // console.log("e", e);
    // eslint-disable-next-line no-throw-literal
    throw "代码运行错误";
  }
}

export function isCheck(componentKey: string) {
  return ["Radio", "Checkbox", "Switch"].includes(componentKey);
}
