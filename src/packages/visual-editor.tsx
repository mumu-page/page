import React from "react";
import { Header, LeftSidebar, RightSidebar, EditorArea } from "./layouts";
import { Context, INITAL_STATE } from "./stores/context";
import { commonReducer } from "./stores/reducer";
import { useLocallyPersistedReducer } from "./hooks";
import { CommonState } from "./stores/typings";
import { LOCAL_STORE_KEY } from "./constants";
import "./visual-editor.scss";

export default () => {
  const [state, commonDispatch] = useLocallyPersistedReducer(
    commonReducer,
    INITAL_STATE,
    LOCAL_STORE_KEY
  );

  return (
    <Context.Provider
      value={{
        ...((state as CommonState) || {}),
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
              <EditorArea />
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
