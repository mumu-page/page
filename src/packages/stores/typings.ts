import { Component } from "react";

export interface commonDispatch<T = boolean> {
    commonDispatch: React.Dispatch<{
        type: string;
        payload: T;
    }>
}

export type componentKeys = 'input' |
    'textarea' |
    'password' |
    'number' |
    'editor' |
    'select' |
    'cascader' |
    'radio' |
    'checkbox' |
    'switch' |
    'slider' |
    'time-picker' |
    'time-range-picker' |
    'date-picker' |
    'date-range-picker' |
    'rate' |
    'upload' |
    'row' |
    'button' |
    '';


export interface FormComProp {
    componentKey: componentKeys;            // 当前拖拽的控件key
    componentProp: object                   // 当前拖拽的控件属性设置
    formItemProp: object;                   // 当前FormItem属性设置
}

export interface FlagState extends commonDispatch<boolean> {
    flag: boolean;
}

export interface NotFoundState extends commonDispatch<boolean> {
    showNotFound: boolean;
}

export interface CommonState extends commonDispatch<object> {
    currentDragComponent: FormComProp; // 当前拖拽的表单控件
    componentList: FormComProp[],                 // 当前编辑区的组件列表
}
