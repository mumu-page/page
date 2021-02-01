import React, { useContext } from 'react';
import { Context } from '../stores/context'
import { PUT_COMPONENT_LIST, SET_FLAG, SET_SHOW_NOT_FOUNT } from "../stores/action-type";

export default function () {
    const { flag, showNotFound, currentDragComponent, commonDispatch } = useContext(Context)

    return (
        <>
            <div
                className='not-found-info'
                onDragOver={(e) => {
                    e.preventDefault()
                    if (!flag && showNotFound) {
                        commonDispatch({ type: SET_FLAG, payload: true })
                    }
                }}
                onDrop={(e) => {
                    commonDispatch({ type: SET_SHOW_NOT_FOUNT, payload: false })
                }}
            >
                {flag && <div className='flag'></div>}
                从左侧拖入或点选组件进行表单设计
            </div>
        </>
    );
}
