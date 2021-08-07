import React, { useState } from 'react'
import { shortid } from '@r-generator/shared'
import { IFormComProp } from '@r-generator/stores'
import { FORM_POOLS } from '../../../constants'
import { RenderPool } from '../../../components'

// const gFormOptions = (data: FormOption[]) => {
//   return data.map((item) => {
//     return {
//       ...item,
//       children: item?.children?.map((cItem) => {
//         const { value, label } = cItem || {}
//         const id = shortid()
//         const ret: IFormComProp & OptionItem = {
//           value,
//           label,
//           id,
//           key: id,
//           componentKey: value,
//           formItemProps: {
//             name: id,
//             label,
//           },
//           colProps: {},
//           rowProps: {},
//           componentProps: {},
//           layout: {
//             frame: { translate: [0, 0] },
//           },
//         }
//         if (['List1'].includes(value)) {
//           ret.colProps = {
//             lg: 24,
//             md: 24,
//             sm: 24,
//             xl: 24,
//             xs: 24,
//             xxl: 24,
//           }
//           ret.formItemProps.labelCol = { span: 24 }
//         }
//         return ret
//       }),
//     }
//   })
// }

// const newOptions = gFormOptions(FORM_POOLS)

export default function FormPool() {
  return <RenderPool title="表单组件" pools={FORM_POOLS} />
}
