import * as React from 'react'
import { EditorArea, Container } from './layouts'
import { Context, INITAL_STATE } from './stores/context'
import { commonReducer } from './stores/reducers'
import { useLocallyPersistedReducer } from './hooks'
import { ICommonState } from './stores/typings'
import { LOCAL_STORE_KEY } from './constants'
import { ReactiveMoveable, InfiniteViewer } from './components'
import './index.css'
import './visual-editor.less'

export default () => {
  const [state, setGlobal] = useLocallyPersistedReducer(
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
