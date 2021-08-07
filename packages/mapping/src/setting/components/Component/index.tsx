import React from 'react'
import { getProperties } from '../../../properties/antd/mapping'
import { ColProperties, CommonProperties, FormItemProperties } from '../../../properties/antd/form'
import { Title } from '../../../components'
import { Empty } from 'antd'
import { useStore } from '@r-generator/stores'

export default function () {
  const { componentList, target } = useStore()

  const has = () => {
    return componentList.length > 0 && target?.id
  }

  const TargetProperties = (
    <>
      <Title text="控件" />
      {getProperties(target.componentKey)}
    </>
  )

  return has() ? (
    <>
      <FormItemProperties />
      {/* {TargetProperties} */}
      <ColProperties />
      <CommonProperties />
    </>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
  )
}
