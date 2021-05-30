import React from 'react'
import { useStore } from '../../hooks'
import FormList from './FormList'
import './index.less'

export default () => {
  const {
    target,
    moveableOptions,
    componentList,
    setGlobal: commonDispatch,
  } = useStore()
  return (
    <div>
      {componentList?.length === 0 ? (
        <div className="not-found-info">从左侧点选组件进行表单设计</div>
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
