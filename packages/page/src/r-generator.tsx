import * as React from 'react'
import Layout from './layouts'
import {
  INITAL_STATE,
  commonReducer,
  useLPReducer,
  Context,
  ICommonState,
} from '@r-generator/stores'
import { LOCAL_STORE_KEY } from './constants'
import './index.css'
import './r-generator.less'
import '@r-generator/mapping/dist/index.css'

export default () => {
  const [state, setGlobal] = useLPReducer(
    commonReducer,
    INITAL_STATE,
    LOCAL_STORE_KEY
  )

  return (
    <Context.Provider
      value={{
        ...((state as ICommonState) || INITAL_STATE),
        setGlobal,
      }}
    >
      <Layout />
    </Context.Provider>
  )
}
