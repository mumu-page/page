import React, { useContext } from 'react'
import { getProperties } from '../../components/key2Component'
import { Context } from '../../stores/context'
import { ColProperties, CommonProperties, FormItemProperties } from '.'
import { Title } from '../../components'
import { Empty } from 'antd'

export default function () {
  const { componentList, target: currentDragComponent } = useContext(Context)

  const has = () => {
    return componentList.length > 0 && currentDragComponent?.id
  }

  const TargetProperties = (
    <>
      <Title text="控件" />
      {getProperties(currentDragComponent.componentKey)}
    </>
  )

  return has() ? (
    <>
      <FormItemProperties />
      {TargetProperties}
      <ColProperties />
      <CommonProperties />
    </>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
  )
}