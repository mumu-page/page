import React from "react";
import { guid } from "../utils";
import { CommonState, FlagState, NotFoundState } from "./typings";

export const initialState: CommonState & FlagState & NotFoundState = {
  flag: false,
  showNotFound: true,
  currentDragComponent: {
    id: guid(),
    componentKey: '',
    formItemProps: {},
    componentProps: {},
  },
  componentList: [],
  commonDispatch: ({ type, payload }: { type: string; payload: unknown }) => {},
};

export const Context = React.createContext(initialState);
