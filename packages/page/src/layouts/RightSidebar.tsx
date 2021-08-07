import React from 'react'
import { Setting } from '@r-generator/mapping'
import { IActionType, useStore } from '@r-generator/stores'
import { Empty } from 'antd'

interface IProps {
  type: IActionType
}

export default function (props: IProps) {
  const { type } = props
  const { mode } = useStore()

  if (type !== 'setting') {
    return null
  }

  const renderContent = () => {
    if (mode === 'assemble') {
      return <Setting />
    }
    return (
      <div className="pt-60">
        <Empty description="自由绘制模式，敬请期待..." />
      </div>
    )
  }

  return (
    <div className="right-sidebar">
      {renderContent()}
    </div>
  )
}
