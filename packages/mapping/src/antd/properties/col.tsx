import React, { useCallback, useEffect, useState } from 'react'
import { Form, Select, InputNumber, Typography, Switch } from 'antd'
import {
  refreshTarget,
  SET_TARGET,
  useStore,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from '@r-generator/stores'
import { FORM_PROPERTIES_OPTIONS } from '../../constants'
import { debounce } from 'lodash'
import { Collapse, Title } from '../../components'
/**
 * 布局增加精简模式和复杂模式
 * 精简模式：支持设置 几列布局等 比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */
export default function () {
  const [form] = Form.useForm()
  const {
    target: currentDragComponent,
    moveableOptions,
    setGlobal: commonDispatch,
  } = useStore()
  const { id, colProps = {} } = currentDragComponent || {}
  const { target } = moveableOptions || {}
  const [mode, setMode] = useState<'专业模式' | '精简模式'>('精简模式')

  const onValuesChange = useCallback(
    debounce((changedValues: any, allValues: any) => {
      if (changedValues.span) {
        allValues['xs'] = changedValues.span
        allValues['sm'] = changedValues.span
        allValues['md'] = changedValues.span
        allValues['lg'] = changedValues.span
        allValues['xl'] = changedValues.span
        allValues['xxl'] = changedValues.span
      }
      // 更新局部组件
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_TARGET,
        payload: {
          id,
          data: {
            colProps: allValues,
          },
        },
      })
      // 更新当前组件
      commonDispatch({
        type: SET_TARGET,
        payload: {
          id,
          colProps: allValues,
        },
      })
      // 重新获取当前选中元素
      refreshTarget(target, commonDispatch)
    }, 200),
    [currentDragComponent.id, mode]
  )

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(colProps)
  }, [currentDragComponent?.id])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      initialValues={{}}
      onValuesChange={onValuesChange}
    >
      <Title
        text="布局"
        extra={
          <Typography.Link
            onClick={() => {
              setMode(mode === '精简模式' ? '专业模式' : '精简模式')
            }}
          >
            <Switch
              checkedChildren="精简模式"
              unCheckedChildren="专业模式"
              checked={mode === '精简模式'}
            />
          </Typography.Link>
        }
      />
      <Collapse defaultActiveKey={['栅格项']}>
        
      </Collapse>
    </Form>
  )
}
