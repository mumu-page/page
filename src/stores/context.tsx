import * as React from 'react'
import { ICommonState } from './typings'

export const INITAL_STATE: ICommonState = {
  target: {
    id: '',
    componentKey: '',
    formProps: {},
    formItemProps: {},
    componentProps: {},
    colProps: {},
    rowProps: {},
    layout: {
      frame: { translate: [0, 0] },
    },
  },
  componentList: [],
  moveableOptions: {
    elClassName: null,
    frame: { translate: [0, 0] },
  },
  commonDispatch: ({
    type,
    payload,
  }: {
    type: string
    payload?: unknown
  }) => {},
}

export const Context = React.createContext(INITAL_STATE)
