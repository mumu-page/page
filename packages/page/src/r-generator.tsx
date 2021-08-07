import * as React from 'react'
import Layout from './layouts'
import {
  INITAL_STATE,
  commonReducer,
  useLPReducer,
  Context,
} from '@r-generator/stores'
import './index.css'
import '@r-generator/mapping/dist/index.css'

export default () => {
  const { commonState, dispatch } = useLPReducer(commonReducer, INITAL_STATE)

  return (
    <Context.Provider
      value={{
        ...commonState,
        setGlobal: dispatch,
      }}
    >
      <Layout />
    </Context.Provider>
  )
}
