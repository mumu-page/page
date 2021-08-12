import React from 'react'
import mapping, { getProperties } from '../../../antd/mapping'
import {
  CommonProperties,
  RowProperties,
  FormProperties,
} from '../../../antd/properties'
import { Title } from '../../../components'
import { Empty } from 'antd'
import { useStore } from '@r-generator/stores'

export default function () {
  const { componentList, target } = useStore()

  const has = () => {
    return componentList.length > 0 && target?.id
  }

  const renderTarget = () => {
    let type = ''
    if (target.type === 'form/item') {
      type = target?.children?.[0]?.type || ''
    }
    if (!mapping.has(type)) return
    return (
      <>
        <Title text="控件" />
        {React.cloneElement(getProperties(type))}
      </>
    )
  }

  return has() ? (
    <>
      {renderTarget()}
      <FormProperties />
      <RowProperties />
      <CommonProperties />
    </>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未选中控件" />
  )
}
