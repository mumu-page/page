import React from 'react';
import { Header, LeftSidebar, RightSidebar, EditorArea } from "./layout";
import './visual-editor.scss';

export default function () {
  return (
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
            <div className='editor-area'>
              <EditorArea />
            </div>
          </div>
        </div>
      </div>
      <div className='sidebar'>
        <RightSidebar />
      </div>
    </div>
  );
}
