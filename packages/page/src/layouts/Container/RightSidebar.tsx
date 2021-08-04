import React from 'react'
import { AntdMapping } from '@r-generator/mapping'
import { useStore } from '@r-generator/stores'
import { Empty } from 'antd'

const { Setting } = AntdMapping

export default function () {
  const { mode } = useStore()

  return (
    <div className="right-sidebar">
      {mode === 'assemble' ? (
        <Setting />
      ) : (
        <div className="p-10">
          <Empty description="自由绘制模式，敬请期待..." />
        </div>
      )}
    </div>
  )
}
