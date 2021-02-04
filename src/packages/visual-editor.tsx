import React, { useReducer } from "react";
import {
  Header,
  LeftSidebar,
  RightSidebar,
  EditorArea,
} from "./layouts";
import { Context, initialState } from "./stores/context";
import { commonReducer } from "./stores/reducer";
import { useLocallyPersistedReducer } from "./hooks";
import "./visual-editor.scss";
import { CommonState, FlagState, NotFoundState } from "./stores/typings";

export default () => {
  const [state, commonDispatch] = useLocallyPersistedReducer(commonReducer, initialState, 'STORE');

  return (
    <Context.Provider
      value={{
        ...(state as CommonState & FlagState & NotFoundState || {}),
        commonDispatch,
      }}
    >
      <div className="visual-editor">
        <div className="main">
          <div className="header">
            <Header />
          </div>
          <div className="content">
            <div className="sidebar">
              <LeftSidebar />
            </div>
            <div className="editor-area-scroll">
              <div className="editor-area">
                <EditorArea />

              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <RightSidebar />
        </div>
      </div>
    </Context.Provider>
  );
};
