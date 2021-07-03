import * as React from 'react'
import { EditorArea, Container } from './layouts'
import { Store, ICommonState } from '@r-generate/core'
import { LOCAL_STORE_KEY } from './constants'
import { ReactiveMoveable, InfiniteViewer } from './components'
import './index.css'
import './r-generate.less'

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
      <Container>
        <InfiniteViewer>
          <EditorArea />
          <ReactiveMoveable />
        </InfiniteViewer>
      </Container>
    </Context.Provider>
  )
}
