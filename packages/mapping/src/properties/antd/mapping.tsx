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
} from 'antd'
import { List1 } from '../../components'
import type { IComponentKeys } from '@r-generator/stores'
import { UploadOutlined } from '@ant-design/icons'

const Mapping = {
  '': {
    properties: <></>,
    component: <></>,
  },
  Input: {
    properties: <InputProperties />,
    component: <Input />,
  },
  'Input.TextArea': {
    properties: <TextAreaProperties />,
    component: <Input.TextArea />,
  },
  'Input.Password': {
    properties: <PasswordProperties />,
    component: <Input.Password />,
  },
  InputNumber: {
    properties: <NumberProperties />,
    component: <InputNumber />,
  },
  Editor: {
    properties: <EditorProperties />,
    component: <>editor</>,
  },
  Select: {
    properties: <SelectProperties />,
    component: <Select />,
  },
  Cascader: {
    properties: <CascaderProperties />,
    component: <Cascader />,
  },
  Radio: {
    properties: <RadioProperties />,
    component: <Radio />,
  },
  Checkbox: {
    properties: <CheckboxProperties />,
    component: <Checkbox />,
  },
  Switch: {
    properties: <SwitchProperties />,
    component: <Switch />,
  },
  Slider: {
    properties: <SliderProperties />,
    component: <Slider />,
  },
  TimePicker: {
    properties: <TimePickerProperties />,
    component: <TimePicker />,
  },
  'TimePicker.RangePicker': {
    properties: <TimeRangePickerProperties />,
    component: <TimePicker.RangePicker />,
  },
  DatePicker: {
    properties: <DatePickerProperties />,
    component: <DatePicker />,
  },
  'DatePicker.RangePicker': {
    properties: <DateRangePickerProperties />,
    component: <DatePicker.RangePicker />,
  },
  Rate: {
    properties: <RateProperties />,
    component: <Rate />,
  },
  Upload: {
    properties: <UploadProperties />,
    component: (
      <Upload>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    ),
  },
  Col: {
    properties: <></>, //<RowProperties />,
    component: <></>, //<RowSortable />,
  },
  Button: {
    properties: <ButtonProperties />,
    component: <Button />,
  },
  List1: {
    properties: <List1Properties />,
    component: <List1 />,
  },
  getComponent(componentKey: IComponentKeys) {
    if (Mapping[componentKey]) {
      return Mapping[componentKey].component
    }
    return <></>
  },
  getProperties(componentKey: IComponentKeys) {
    if (Mapping[componentKey]) {
      return Mapping[componentKey].properties
    }
    return <></>
  },
}

export default Mapping
