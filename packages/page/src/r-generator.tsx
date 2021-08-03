import * as React from 'react'
import { Container } from './layouts'
import { Store, ICommonState } from '@r-generator/core'
import { LOCAL_STORE_KEY } from './constants'
import './index.css'
import './r-generator.less'
import '@r-generator/mapping/dist/index.css'

const { Context, INITAL_STATE, commonReducer, Hooks } = Store
const { useLPReducer } = Hooks

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
      <Container />
    </Context.Provider>
  )
}
