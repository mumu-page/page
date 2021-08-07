import React from 'react'
import List from './List'
import { useStore } from '@r-generator/stores'
import './index.less'

export default () => {
  const {
    target,
    moveableOptions,
    componentList,
    setGlobal,
  } = useStore()
  return (
    <div className="assemble-area">
      {componentList?.length === 0 ? (
        <div className="not-found-info">从左侧点选或拖拽组件进行表单设计</div>
      ) : (
        <List
          target={target}
          componentList={componentList}
          moveableOptions={moveableOptions}
          setGlobal={setGlobal}
        />
      )}
    </div>
  )
}
