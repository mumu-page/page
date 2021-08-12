import React from 'react'
import { DatePicker as DatePickerOld } from 'antd'

const { RangePicker: RangePickerOld } = DatePickerOld

export default function DatePicker(props: any) {
  return <DatePickerOld {...props}></DatePickerOld>
}

DatePicker.RangePicker = function RangePicker(props: any) {
  return <RangePickerOld {...props}></RangePickerOld>
}
