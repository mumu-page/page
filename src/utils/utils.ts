import React from 'react'
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
} from 'antd'
import { ICONS } from '../constants'
import { IFormComProp } from '../stores/typings'
import { Target_ClassName } from '../constants/constants'
import { SET_MOVEABLE_OPTIONS } from '../stores/action-type'
const Babel = require('Babel')

export function getContext() {
  const { TimePicker: TP, ...OtherDatePickerCom } = DatePicker
  return {
    React,
    Form,
    Input,
    ...Input,
    InputNumber,
    Select,
    ...Select,
    Cascader,
    Radio,
    Checkbox,
    Switch,
    Slider,
    TimePicker,
    ...TimePicker,
    DatePicker,
    ...OtherDatePickerCom,
    Rate,
    Upload,
    Row,
    Col,
    Button,
    ...ICONS,
  }
}

export function isChildren(componentKey: string) {
  return ['Upload'].includes(componentKey)
}

export function isSelect(componentKey: string) {
  return [
    'Select',
    'Cascader',
    'TimePicker',
    'TimePicker.RangePicker',
    'DatePicker',
    'DatePicker.RangePicker',
  ].includes(componentKey)
}

export function hasNotPlaceholder(componentKey: string) {
  return [
    'Radio',
    'Checkbox',
    'Switch',
    'Slider',
    'Rate',
    'Upload',
    'Row',
    'Button',
  ].includes(componentKey)
}

export function isDatePicker(componentKey: string) {
  return [
    'TimePicker',
    'TimePicker.RangePicker',
    'DatePicker',
    'DatePicker.RangePicker',
  ].includes(componentKey)
}

export function isRenderFormItem(componentKey: string) {
  return !['Col', 'Button'].includes(componentKey)
}

export function isColComponent(componentKey: string) {
  return ['Col'].includes(componentKey)
}

export function isDatePickerRange(componentKey: string) {
  return ['TimePicker.RangePicker', 'DatePicker.RangePicker'].includes(
    componentKey
  )
}

/**
 * 请传入一个function componet 字符串，将返回一个编译后函数组件
 * @param input
 * @returns
 */
export async function string2Component(input?: string) {
  if (!input) return ''
  try {
    let output = Babel.transform(`${input}`, {
      presets: ['react', 'es2015'],
    }).code
    output = output?.replace('"use strict";', '').trim()
    // eslint-disable-next-line no-new-func
    const func = new Function('context', `with(context){return ${output}}`)
    return () => func(getContext()) // 为了能够在组件中执行Hook，不直接执行函数
  } catch (e) {
    // console.log('e', e)
    throw new Error(e)
  }
}

export function isCheck(componentKey: string) {
  return ['Radio', 'Checkbox', 'Switch'].includes(componentKey)
}

/**
 * 解析key为['aa.bb']的对象
 * @param target
 * @param keys
 * @param result
 */
export function decodeKey(
  target: { [key: string]: any },
  keys: string[],
  result = {} as any
) {
  keys.forEach((key) => {
    result[key] = {}
  })
  try {
    Object.keys(target).forEach((key) => {
      const [parentKey, childKey] = key?.split('.')
      const val = target[key]
      result[parentKey][childKey] = val
    })
  } finally {
    return result
  }
}

/**
 * 将对象转为key为[aa.bb]的对象
 * @param target1
 * @param target2
 * @param result
 */
export function encodeKey(
  target1: {
    key: string
    data: { [key: string]: any }
  },
  target2: {
    key: string
    data: { [key: string]: any }
  },
  result = {} as any
) {
  try {
    Object.keys(target1.data).forEach((key) => {
      result[`${target1.key}.${key}`] = target1.data[key]
    })
    Object.keys(target2.data).forEach((key) => {
      result[`${target2.key}.${key}`] = target2.data[key]
    })
  } finally {
    return result
  }
}

/**
 * 获取辅助线元素列表elementGuidelines 当前位置frame 当前元素target
 * @param id
 * @param selectors
 * @param list
 */
export function findTarget(
  id: string | number | undefined,
  list: IFormComProp[],
  selectors = `.${Target_ClassName}`
) {
  let elementGuidelines = [].slice.call(
    document.querySelectorAll(selectors) as any
  )
  const target = elementGuidelines.filter((item: any) => {
    return item?.getAttribute?.('data-id') === id
  })?.[0]
  const frame = list?.filter((item) => {
    return item.id === id
  })?.[0]?.layout?.frame

  // 将当前元素从divList中移除, 当前元素不再作为参考辅助线
  elementGuidelines = elementGuidelines.filter((item: any) => {
    return item?.getAttribute?.('data-id') !== id
  })

  return {
    elementGuidelines,
    target,
    frame,
  }
}

// 重新获取当前选中元素
export function refreshTarget(
  target: unknown,
  commonDispatch: React.Dispatch<{
    type: string
    payload?: object | undefined
  }>
) {
  requestAnimationFrame(() => {
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        target: null, // immner会认为targer是同一个元素，导致不更新
      },
    })
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        target,
      },
    })
  })
}
