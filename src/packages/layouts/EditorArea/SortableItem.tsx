import React, { memo, useContext } from 'react'
import { Form, Button } from 'antd'
import { FormComProp } from '../../stores/typings'
import { debounce } from 'lodash'
import {
  DEL_COMPONENT_LIST,
  PUT_COMPONENT_LIST,
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from '../../stores/action-type'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { isCheck, isDatePicker } from '../../utils/utils'
import { ICONS, key2Component } from '../../constants'
import * as moment from 'moment'
import * as uuid from 'uuid'
import { Context } from '../../stores/context'
import { canChosen } from './data'
import { areEqualItem } from './utils'

export default memo((prop: FormComProp) => {
  const {
    id,
    componentKey,
    formItemProps = {},
    componentProps = {},
    form,
  } = prop
  const { commonDispatch } = useContext(Context)

  // 清除值
  if (
    isDatePicker(componentKey) &&
    !moment.isMoment(form.getFieldValue(formItemProps.name))
  ) {
    form.setFieldsValue({
      [formItemProps.name]: '',
    })
  }
  if (['Select'].includes(componentKey)) {
    componentProps.onSelect = (value: any) => {
      console.log('value', value)
    }
  } else if (['Input', 'Input.TextArea'].includes(componentKey)) {
    componentProps.onChange = debounce((e: any) => {
      const value = e?.target?.value
      commonDispatch({
        type: SET_CURRENT_DRAG_COMPONENT,
        payload: {
          id,
          componentProps: {
            defaultValue: value,
          },
        },
      })
    })
    const upList = (value: any) => {
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
        payload: {
          id,
          data: {
            componentProps: {
              defaultValue: value,
            },
          },
        },
      })
    }
    componentProps.onPressEnter = (e: any) => {
      const value = e?.target?.value
      upList(value)
    }
    componentProps.onBlur = (e: any) => {
      const value = e?.target?.value
      upList(value)
    }
  } else {
    componentProps.onChange = (value: any) => {
      console.log('value', value)
    }
  }
  const { defaultValue, ...componentOtherProps } = componentProps
  // 输入框前后图标处理
  const componentPropsKey = Object.keys(componentOtherProps)
  if (['Input'].includes(componentKey)) {
    if (componentPropsKey.includes('prefix')) {
      const IconComponent =
        (ICONS as any)[componentOtherProps['prefix']] || React.Fragment
      componentOtherProps['prefix'] = <IconComponent />
    }
    if (componentPropsKey.includes('suffix')) {
      const IconComponent =
        (ICONS as any)[componentOtherProps['suffix']] || React.Fragment
      componentOtherProps['suffix'] = <IconComponent />
    }
  }

  return (
    <div key={id} className="component-warp">
      <div className="action-btn">
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<CopyOutlined />}
          onMouseLeave={() => {
            canChosen.set(true)
          }}
          onMouseEnter={() => {
            canChosen.set(false)
          }}
          onClick={() => {
            canChosen.set(true)
            const newId = uuid.v4()
            commonDispatch({
              type: SET_CURRENT_DRAG_COMPONENT,
              payload: {
                id: newId,
                componentKey,
              },
            })
            commonDispatch({
              type: PUT_COMPONENT_LIST,
              payload: {
                ...prop,
                id: newId,
                chosen: true,
              },
            })
          }}
        />
        <Button
          type="default"
          shape="circle"
          size="small"
          style={{ marginLeft: '5px' }}
          danger
          icon={<DeleteOutlined />}
          onMouseLeave={() => {
            canChosen.set(true)
          }}
          onMouseEnter={() => {
            canChosen.set(false)
          }}
          onClick={() => {
            commonDispatch({
              type: DEL_COMPONENT_LIST,
              payload: { id },
            })
          }}
        />
      </div>
      <Form.Item
        {...formItemProps}
        valuePropName={isCheck(componentKey) ? 'checked' : 'value'}
        style={{ marginBottom: 0 }}
      >
        {React.cloneElement(
          key2Component[componentKey]?.component || <></>,
          componentOtherProps
        )}
      </Form.Item>
    </div>
  )
}, areEqualItem)
