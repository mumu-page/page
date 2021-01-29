import React from "react"
import { CommonState, FlagState, NotFoundState } from "./typings";

export const initialState: CommonState & FlagState & NotFoundState = {
    flag: false,
    showNotFound: true,
    currentDragComponent: {
        componentKey: '',
        formItemProp: {},
        componentProp: {}
    },
    componentList: [],
    commonDispatch: ({ type, payload }: { type: string, payload: unknown }) => { }
}

export const Context = React.createContext(initialState)
