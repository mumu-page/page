import React from 'react'
import FormList from './List'
import { useStore } from '@r-generator/stores'
import './index.less'

export default () => {
  const {
    target,
    moveableOptions,
    componentList,
    setGlobal: commonDispatch,
  } = useStore()
  return (
    <div className="assemble-area">
      {componentList?.length === 0 ? (
        <div className="not-found-info">从左侧点选或拖拽组件进行表单设计</div>
      ) : (
        <FormList
          target={target}
          componentList={componentList}
          moveableOptions={moveableOptions}
          setGlobal={commonDispatch}
        />
      )}
    </div>
  )
}
