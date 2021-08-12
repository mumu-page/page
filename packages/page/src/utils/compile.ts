import * as React from 'react'
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
  notification,
} from 'antd'
import { List1 } from '@r-generator/mapping'
import { PoolItem } from '@r-generator/stores'
import { ICONS } from '../constants/constants'
import { Generate } from '@r-generator/core'
import { transform } from '@babel/standalone'

class Compile {
  genrate: Generate
  constructor(genrate: Generate) {
    this.genrate = genrate
  }
  // 去除不要的代码
  replace(code?: string) {
    const selfCode = code || '' /*  || this.genrate.run() */
    return (
      selfCode
        .substring(
          selfCode.indexOf('export default'),
          selfCode.indexOf('</Form>')
        )
        .replace('export default', '') + '</Form>}'
    )
  }
  async string2Component(list: PoolItem[] = [], code?: string) {
    try {
      let input = this.replace(code)
      let output = transform(input, {
        // sourceType: 'script',
        presets: ['react', 'es2015'],
      }).code
      output = output?.replace('"use strict";', '').trim()
      output = output?.replace('(function', 'return (function') // 里面可能会报错
      //   console.log(output)
      //   eslint-disable-next-line no-new-func
      const func = new Function(
        'context',
        `with(context){
            ${output}
        }`
      )
      //   console.log(func)
      return () => {
        try {
          return func(this.getContext(list))
        } catch (error) {
          console.log('error', error)
          notification.open({
            message: '运行错误',
            description: error instanceof Error ? error.message : `${error}`,
          })
        }
      } // 为了能够在组件中执行Hook，不直接执行函数
    } catch (e) {
      console.log('e', e)
      notification.open({
        message: '运行错误',
        description: e instanceof Error ? e.message : `${e}`,
      })
    }
  }
  getContext(list: PoolItem[]) {
    const { TimePicker: TP, ...OtherDatePickerCom } = DatePicker
    const result = {
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
      List1,
    } as any
    // list组件可能有多个，但他们最终编译时都是使用同一个
    // TODO: 但是这种方式并不太友好，可以改成加载编辑器中的代码 实现直接编辑
    list.forEach((item) => {
      const name = item.componentKey
      const tag = String(item.id).slice(0, 4)
      result[`${name}${tag}`] = result.List1
    })
    return result
  }
}

export default Compile
