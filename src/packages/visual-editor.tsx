import { stat } from 'fs';
import React, { useReducer } from 'react';
import { Header, LeftSidebar, RightSidebar, EditorArea, NotFoundInfo } from "./layout";
import { Context, initialState } from './stores/context'
import { commonReducer } from "./stores/reducer";
import './visual-editor.scss';

export default () => {
  const [state, commonDispatch] = useReducer(commonReducer, initialState)

  return (
    <Context.Provider value={{
      ...state,
      commonDispatch
    }}>
      <div className='visual-editor'>
        <div className='main'>
          <div className='header'>
            <Header />
          </div>
          <div className='content'>
            <div className='sidebar'>
              <LeftSidebar />
            </div>
            <div className='editor-area-scroll'>
              {
                !state.showNotFound ? <div className='editor-area'>
                  <EditorArea />
                </div> : <NotFoundInfo />
              }
            </div>
          </div>
        </div>
        <div className='sidebar'>
          <RightSidebar />
        </div>
      </div>
    </Context.Provider>
  );
}
