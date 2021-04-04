import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Form, Select, InputNumber, Typography, Switch } from 'antd'
import { Context } from '../stores/context'
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from '../stores/action-type'
import { FORM_PROPERTIES_OPTIONS } from '../constants/constants'
import { refreshTarget } from '../utils/utils'
import { CustomCollapse, Title } from '../components'
import { debounce } from 'lodash'

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
    commonDispatch,
  } = useContext(Context)
  const { id, colProps = {}, } = currentDragComponent || {}
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
              checkedChildren="专业模式"
              unCheckedChildren="精简模式"
              checked={mode === '专业模式'}
            />
          </Typography.Link>
        }
      />
      <CustomCollapse defaultActiveKey={['栅格项']}>
        <CustomCollapse.Panel
          header={
            mode === '专业模式' ? (
              <Form.Item
                label="栅格项"
                tooltip="屏幕 * 响应式栅格"
                labelCol={{ span: 16 }}
                name="span"
                className="mb-0"
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            ) : (
              '栅格项'
            )
          }
          key="栅格项"
        >
          {mode === '精简模式' && (
            <>
              <Form.Item label="占整行" name="span">
                <Select
                  allowClear
                  onClear={() => {
                    const newData = {
                      span: null,
                      xs: null,
                      sm: null,
                      md: null,
                      lg: null,
                      xl: null,
                      xxl: null,
                    }
                    form.setFieldsValue(newData)
                    // 更新局部组件
                    commonDispatch({
                      type: UPDATE_COMPONENT_LIST_BY_TARGET,
                      payload: {
                        id,
                        data: {
                          colProps: newData,
                        },
                      },
                    })
                    // 更新当前组件
                    commonDispatch({
                      type: SET_TARGET,
                      payload: {
                        id,
                        colProps: newData,
                      },
                    })
                  }}
                >
                  <Select.Option value={6}>四分之一</Select.Option>
                  <Select.Option value={8}>三分之一</Select.Option>
                  <Select.Option value={12}>一半</Select.Option>
                  <Select.Option value={24}>占满</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          {mode === '专业模式' && (
            <>
              <Form.Item
                name="xs"
                label="屏幕 < 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="sm"
                label="屏幕 ≥ 576px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="md"
                label="屏幕 ≥ 768px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="lg"
                label="屏幕 ≥ 992px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="xl"
                label="屏幕 ≥ 1200px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
              <Form.Item
                name="xxl"
                label="屏幕 ≥ 1600px 响应式栅格"
                labelCol={{ span: 17 }}
              >
                <InputNumber className="w-100" min={0} max={24} />
              </Form.Item>
            </>
          )}
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  )
}
