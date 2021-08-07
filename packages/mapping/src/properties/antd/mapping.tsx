import {
  InputProperties,
  TextAreaProperties,
  PasswordProperties,
  NumberProperties,
  EditorProperties,
  SelectProperties,
  CascaderProperties,
  RadioProperties,
  CheckboxProperties,
  SwitchProperties,
  SliderProperties,
  TimePickerProperties,
  TimeRangePickerProperties,
  DatePickerProperties,
  DateRangePickerProperties,
  RateProperties,
  UploadProperties,
  ButtonProperties,
  List1Properties,
} from './form'
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
  Button,
  Form,
} from 'antd'
import { List1 } from '../../components'
import { UploadOutlined } from '@ant-design/icons'
import React from 'react'

class Mapping {
  Component: React.CElement<{}, React.Component<{}, any, any>>
  Properties: React.CElement<{}, React.Component<{}, any, any>>
  constructor(Component: any, Properties: any) {
    if (Component == null || typeof Component === 'undefined') Component = <></>
    if (Properties == null || typeof Properties === 'undefined')
      Properties = <></>
    this.Component = React.createElement(Component)
    this.Properties = React.createElement(Properties)
  }
}

const mapping = new Map<string, Mapping>()
mapping.set('input', new Mapping(Input, InputProperties))
mapping.set('input/text-area', new Mapping(Input.TextArea, TextAreaProperties))
mapping.set('input/password', new Mapping(Input.Password, PasswordProperties))
mapping.set('input-number', new Mapping(InputNumber, NumberProperties))
mapping.set('editor', new Mapping(null, EditorProperties))
mapping.set('select', new Mapping(Select, SelectProperties))
mapping.set('cascader', new Mapping(Cascader, CascaderProperties))
mapping.set('radio', new Mapping(Radio, RadioProperties))
mapping.set('checkbox', new Mapping(Checkbox, CheckboxProperties))
mapping.set('switch', new Mapping(Switch, SwitchProperties))
mapping.set('slider', new Mapping(Slider, SliderProperties))
mapping.set('time-picker', new Mapping(TimePicker, TimePickerProperties))
mapping.set(
  'time-picker/range-picker',
  new Mapping(TimePicker.RangePicker, TimeRangePickerProperties)
)
mapping.set('date-picker', new Mapping(DatePicker, DatePickerProperties))
mapping.set(
  'date-picker/range-picker',
  new Mapping(DatePicker.RangePicker, DateRangePickerProperties)
)
mapping.set('rate', new Mapping(Rate, RateProperties))
mapping.set('button', new Mapping(Button, ButtonProperties))
mapping.set('list1', new Mapping(List1, List1Properties))
mapping.set(
  'upload',
  new Mapping(
    (
      <Upload>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    ),
    UploadProperties
  )
)
mapping.set('form/item', new Mapping(Form.Item, null))

export function getComponent(key: string) {
  if (mapping.has(key)) {
    return mapping.get(key)?.Component || <></>
  }
  return <></>
}

export function getProperties(key: string) {
  if (mapping.has(key)) {
    return mapping.get(key)?.Properties || <></>
  }
  return <></>
}

export default mapping
