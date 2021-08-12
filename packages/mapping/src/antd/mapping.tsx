import {
  InputProperties,
  TextAreaProperties,
  PasswordProperties,
  EditorProperties,
  SelectProperties,
  UploadProperties,
  ButtonProperties,
  List1Properties,
} from './properties'
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
} from './components'
import { List1 } from '../components'
import { UploadOutlined } from '@ant-design/icons'
import React from 'react'

class Mapping {
  Component: React.CElement<{}, React.Component<{}, any, any>>
  Properties: React.CElement<{}, React.Component<{}, any, any>>
  constructor(Component: any, Properties: any, props: any = {}) {
    if (Component == null || typeof Component === 'undefined') Component = <></>
    if (Properties == null || typeof Properties === 'undefined')
      Properties = <></>
    this.Component = React.createElement(Component, props)
    this.Properties = React.createElement(Properties)
  }
}

const mapping = new Map<string, Mapping>()
mapping.set('input', new Mapping(Input, InputProperties))
mapping.set('input/text-area', new Mapping(Input.TextArea, TextAreaProperties))
mapping.set('input/password', new Mapping(Input.Password, PasswordProperties))
mapping.set('input-number', new Mapping(InputNumber, null))
mapping.set('editor', new Mapping(null, EditorProperties))
mapping.set('select', new Mapping(Select, SelectProperties))
mapping.set('cascader', new Mapping(Cascader, null))
mapping.set('radio', new Mapping(Radio, null))
mapping.set('checkbox', new Mapping(Checkbox, null))
mapping.set('switch', new Mapping(Switch, null))
mapping.set('slider', new Mapping(Slider, null))
mapping.set('time-picker', new Mapping(TimePicker, null))
mapping.set(
  'time-picker/range-picker',
  new Mapping(TimePicker.RangePicker, null)
)
mapping.set('date-picker', new Mapping(DatePicker, null))
mapping.set(
  'date-picker/range-picker',
  new Mapping(DatePicker.RangePicker, null)
)
mapping.set('rate', new Mapping(Rate, null))
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
