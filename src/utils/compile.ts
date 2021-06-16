import { IFormComProp } from '../stores/typings'
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
} from 'antd'
import List1 from '../properties/antd/widgets/list1'
import { ICONS } from '../constants/constants'
import GenrateCode from './genrate'

class Compile {
  genrate: GenrateCode
  constructor(genrate: GenrateCode) {
    console.log(genrate)
    this.genrate = genrate
  }
  // 去除不要的代码
  replace() {
    const code = this.genrate.generate()
    return (
      code
        .substring(code.indexOf('export default'), code.indexOf('</Form>'))
        .replace('export default', '') + '</Form>}'
    )
  }
  async string2Component(list: IFormComProp[] = [], code?: string) {
    try {
      let input = code || this.replace()
      let output = (window as any).Babel.transform(`${input}`, {
        presets: ['react', 'es2015'],
      }).code
      output = output?.replace('"use strict";', '').trim()
      output = output?.replace('(function', 'return (function')
      // console.log(output)
      // eslint-disable-next-line no-new-func
      const func = new Function('context', `with(context){${output}}`)
      // console.log(func)
      return () => func(this.getContext(list)) // 为了能够在组件中执行Hook，不直接执行函数
    } catch (e) {
      // console.log('e', e)
      if (e instanceof Error) throw e
      throw new Error(e)
    }
  }
  getContext(list: IFormComProp[]) {
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
