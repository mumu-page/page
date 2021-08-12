import React from 'react'
import { TimePicker as TimePickerOld } from 'antd'

const { RangePicker: RangePickerOld } = TimePickerOld

export default function TimePicker(props: any) {
  return <TimePickerOld {...props}></TimePickerOld>
}

TimePicker.RangePicker = function RangePicker(props: any) {
  return <RangePickerOld {...props}></RangePickerOld>
}
