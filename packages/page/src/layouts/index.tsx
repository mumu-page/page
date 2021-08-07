import React, { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import LeftAction from './LeftAction'
import RightAction from './RightAction'
import { Moveable, InfiniteViewer } from '../components'
import AssembleArea from './components/AssembleArea'
import DrawArea from './components/DrawArea'
import { useStore, IActionType, UPDATE_ACTION_TYPE } from '@r-generator/stores'
import { resetViewport } from '../utils/utils'
import './index.less'

export default () => {
  const { mode, setGlobal, actionType } = useStore()

  const handleType = (val: IActionType) => {
    if (actionType === val && actionType !== 'swtich') {
      setGlobal({
        type: UPDATE_ACTION_TYPE,
        payload: {
          actionType: '',
        },
      })
    } else {
      setGlobal({
        type: UPDATE_ACTION_TYPE,
        payload: {
          actionType: val,
        },
      })
    }
  }

  const renderDesignArea = () => {
    if (mode === 'assemble') {
      return <AssembleArea />
    }
    return (
      <InfiniteViewer>
        <DrawArea />
        <Moveable />
      </InfiniteViewer>
    )
  }

  useEffect(() => {
    if (
      ['form-pool', 'setting', '', 'switch', 'history'].includes(actionType)
    ) {
      resetViewport()
    }
  }, [actionType])

  return (
    <div className="container">
      <LeftAction type={actionType} handleType={handleType} />
      <LeftSidebar />
      <div className="content">{renderDesignArea()}</div>
      <RightSidebar type={actionType} />
      <RightAction type={actionType} handleType={handleType} />
    </div>
  )
}
