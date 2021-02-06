import React from 'react'
import { CommonState } from './typings'

export const initialState: CommonState = {
  currentDragComponent: {
    id: '',
    componentKey: '',
    formItemProps: {},
    componentProps: {},
  },
  componentList: [],
  commonDispatch: ({
    type,
    payload,
  }: {
    type: string
    payload?: unknown
  }) => {},
}

export const Context = React.createContext(initialState)
