import React from 'react'
import { CommonState } from './typings'

export const INITAL_STATE: CommonState = {
  currentDragComponent: {
    id: "",
    componentKey: "",
    formProps: {},
    formItemProps: {},
    componentProps: {},
    colProps: {},
    rowProps: {},
  },
  componentList: [],
  commonDispatch: ({
    type,
    payload,
  }: {
    type: string;
    payload?: unknown;
  }) => {},
};

export const Context = React.createContext(INITAL_STATE)
