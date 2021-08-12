import React from 'react'
import { FORM_POOLS } from '@r-generator/mapping'
import { RenderPool } from '../../../components'

export default function FormPool() {
  return <RenderPool title="表单组件" pools={FORM_POOLS} />
}
