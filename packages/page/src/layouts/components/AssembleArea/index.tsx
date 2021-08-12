import React from 'react'
import List from './List'
import { useStore } from '@r-generator/stores'
import './index.less'

export default () => {
  const { componentList, actionType } = useStore()
  const type = actionType === 'form-pool' ? '表单' : '页面'

  return (
    <div className="assemble-area">
      {componentList?.length === 0 ? (
        <div className="not-found-info">
          从左侧点选或拖拽组件进行
          <span style={{ fontWeight: 'bold' }}>{type}</span>
          设计
        </div>
      ) : (
        <List />
      )}
    </div>
  )
}
