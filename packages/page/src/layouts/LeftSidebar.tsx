import React from 'react'
import { Empty } from 'antd'
import { useStore } from '@r-generator/stores'
import FormPool from './components/FormPool'
import { BtnTypes } from '.'
import BasePool from './components/BasePool'
import ChartPool from './components/ChartPool'

interface IProps {
  type: BtnTypes
}

export default (props: IProps) => {
  const { type } = props
  const { mode } = useStore()

  const renderBody = () => {
    if (mode === 'draw') {
      return (
        <div className="p-10">
          <Empty description="当前为自由绘制模式，请切换为页面组装模式..." />
        </div>
      )
    }
    if (type === 'form-pool') {
      return <FormPool />
    }
    if (type === 'base-pool') {
      return <BasePool />
    }
    if (type === 'chart-pool') {
      return <ChartPool />
    }
  }

  if (!['form-pool', 'base-pool', 'chart-pool'].includes(type)) {
    return null
  }

  return (
    <div className="left-sidebar">
      <div className="body">{renderBody()}</div>
    </div>
  )
}
