import React from 'react'
import { Setting } from '@r-generator/mapping'
import { useStore } from '@r-generator/stores'
import { Empty } from 'antd'
import { BtnTypes } from '.'

interface IProps {
  type: BtnTypes
}

export default function (props: IProps) {
  const { type } = props
  const { mode } = useStore()

  if (type !== 'setting') {
    return null
  }

  return (
    <div className="right-sidebar">
      {mode === 'assemble' ? (
        <Setting />
      ) : (
        <div className="pt-60">
          <Empty description="自由绘制模式，敬请期待..." />
        </div>
      )}
    </div>
  )
}
