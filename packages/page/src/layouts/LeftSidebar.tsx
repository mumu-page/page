import React, { useEffect, useState } from 'react'
import { useStore } from '@r-generator/stores'
import FormPool from './components/FormPool'
import BasePool from './components/BasePool'
import ChartPool from './components/ChartPool'
import History from './components/History'

export default () => {
  const { actionType } = useStore()

  const renderBody = () => {
    if (actionType === 'form-pool') {
      return <FormPool />
    }
    if (actionType === 'base-pool') {
      return <BasePool />
    }
    if (actionType === 'chart-pool') {
      return <ChartPool />
    }
    if (actionType === 'history') {
      return <History />
    }
    return <></>
  }

  if (
    !['form-pool', 'base-pool', 'chart-pool', 'history'].includes(actionType)
  ) {
    return null
  }

  return (
    <div className="left-sidebar">
      <div className="body">{renderBody()}</div>
    </div>
  )
}
