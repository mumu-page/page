import React, { useContext, useEffect, useState } from 'react';
import { Form, Input } from "antd";
import { Context } from '../stores/context';
import { key2Component } from '../constants';
import { guid } from '../utils';
import { FormComProp } from '../stores/typings';
import { PUT_COMPONENT_LIST, SET_FLAG } from '../stores/action-type';

export default () => {
  const { flag, componentList, currentDragComponent, commonDispatch } = useContext(Context)
  const [position, setPosition] = useState({})
  console.log('componentList', componentList)

  const setFlag = (val: boolean) => {
    if (val && !flag) {
      commonDispatch({ type: SET_FLAG, payload: val })
    }
    if (!val && flag) {
      commonDispatch({ type: SET_FLAG, payload: val })
    }
  }

  const Component = (prop: FormComProp) => {
    const { componentKey, formItemProp = {}, componentProp = {} } = prop
    return <Form.Item {...formItemProp}>
      {React.cloneElement(<div
        draggable
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          setFlag(false)
        }}
        onDragEnd={(e) => {
          setFlag(false)
        }}
        className='component-warp'>
        {key2Component[componentKey]?.component}
      </div> || <></>, componentProp)}
    </Form.Item>
  }

  return (
    <div
      style={{
        height: '100%',
        position: 'relative'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setFlag(true)
      }}
      onDrop={(e) => {
        // commonDispatch({ type: SET_FLAG, payload: false })
        setFlag(false)
      }}
    >
      {componentList.map(item => {
        return <Component
          key={guid()}
          formItemProp={item.formItemProp}
          componentProp={item.componentProp}
          componentKey={item.componentKey} />
      })}

      {flag && <div
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          setFlag(false)
        }}
        className='editor-area-flag' style={position}></div>}
    </div >
  );
}
