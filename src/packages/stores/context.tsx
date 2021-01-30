import React from "react";
import { guid } from "../utils";
import { CommonState, FlagState, NotFoundState } from "./typings";

export const initialState: CommonState & FlagState & NotFoundState = {
  flag: false,
  showNotFound: true,
  currentDragComponent: {
    id: guid(),
    componentKey: "",
    formItemProp: {},
    componentProp: {},
  },
  componentList: [],
  commonDispatch: ({ type, payload }: { type: string; payload: unknown }) => {},
};

export const Context = React.createContext(initialState);
