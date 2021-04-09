import React, { useContext } from 'react'
import { Context } from '../../stores/context'
import ComponentList from './ComponentList'
import './index.less'

export default () => {
  const { target, moveableOptions, componentList, commonDispatch } = useContext(Context)
  return (
    <>
      <ComponentList
        target={target}
        componentList={componentList}
        moveableOptions={moveableOptions}
        commonDispatch={commonDispatch}
      />
      {componentList.length === 0 && (
        // <div className="not-found-info">从左侧拖入或点选组件进行表单设计</div>
        <div className="not-found-info">从左侧点选组件进行表单设计</div>
      )}
    </>
  )
}
