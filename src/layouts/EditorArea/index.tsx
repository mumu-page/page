import React from 'react'
import { Utils } from '../../stores'
import FormList from './FormWrap'
import './index.less'

export default () => {
  const {
    target,
    moveableOptions,
    componentList,
    setGlobal: commonDispatch,
  } = Utils.useStore()
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
