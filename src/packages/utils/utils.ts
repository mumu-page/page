import React from "react";
import * as Babel from "@babel/standalone";
import * as Antd from "antd";
import * as Icons  from "@ant-design/icons";

const context = {
  React,
  ...Antd,
  ...Icons
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

export function isDatePickerRange(componentKey: string) {
  return [
    "TimePicker.RangePicker",
    "DatePicker.RangePicker",
  ].includes(componentKey);
}

export async function string2Component(input?: string) {
  if (!input) return "";
  try {
    let output = Babel.transform(`<>${input}</>`, { presets: ["react", "es2015"] }).code;
    output = output?.replace('"use strict";', "").trim();
    const func = new Function(
      "context",
      `with(context){const ret = ${output};return ret;}`
    );
    return func(context);
  } catch (e) {
    throw "代码运行错误";
  }
}

export function isCheck(componentKey: string) {
  return [
    "Radio",
    "Checkbox",
    "Switch",
  ].includes(componentKey);
}