import React, { useContext, useEffect } from 'react'
import { Form, Select, InputNumber, Collapse, Tooltip } from 'antd'
import { Context } from '../stores/context'
import {
  SET_CURRENT_DRAG_COMPONENT,
  UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
} from '../stores/action-type'
import { FORM_PROPERTIES_OPTIONS } from '../constants/constants'
import CheckboxField from '../components/FormFields/CheckboxField'
import { CaretRightOutlined } from '@ant-design/icons'
import { formatObject } from '../utils/utils'

export default function () {
  const [form] = Form.useForm()
  const { currentDragComponent, commonDispatch } = useContext(Context)
  const { id, colProps = {}, rowProps = {} } = currentDragComponent || {}

  const onValuesChange = (changedValues: any, allValues: any) => {
    const newAllValues = formatObject(allValues, ['all', 'single'])
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_CURRENT_DRAG,
      payload: {
        id,
        data: {
          colProps: newAllValues?.single,
        },
      },
    })
    commonDispatch({
      type: SET_CURRENT_DRAG_COMPONENT,
      payload: {
        id,
        colProps: newAllValues?.single,
        rowProps: newAllValues?.all,
      },
    })
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      ...colProps,
      ...rowProps,
    })
  }, [])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      initialValues={{
        align: 'top',
        gutter: 0,
        justify: 'start',
        wrap: true,
      }}
      onValuesChange={onValuesChange}
    >
      <Collapse
        defaultActiveKey={['栅格数']}
        className="site-collapse-custom-collapse"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header={
            <Form.Item
              label="全部布局"
              tooltip="在此设置的内容将应用于全部控件"
              className="mb-0"
            ></Form.Item>
          }
          key="全部布局"
          className="site-collapse-custom-panel"
        >
          <Form.Item label="垂直对齐" name="all.align">
            <Select>
              <Select.Option value="top">靠上</Select.Option>
              <Select.Option value="middle">居中</Select.Option>
              <Select.Option value="bottom">靠下</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="水平排列" name="all.justify">
            <Select>
              <Select.Option value="start">水平靠左分布</Select.Option>
              <Select.Option value="middle">水平靠右分布</Select.Option>
              <Select.Option value="center">水平居中分布</Select.Option>
              <Select.Option value="space-around">水平平均分布</Select.Option>
              <Select.Option value="space-between">
                水平两侧顶格分布
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="栅格间隔" name="all.gutter" labelCol={{ span: 17 }}>
            <InputNumber className="w-100" min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="屏幕 * 响应式栅格"
            labelCol={{ span: 17 }}
            name="all.span"
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.xs"
            label="屏幕 < 576px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.sm"
            label="屏幕 ≥ 576px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.md"
            label="屏幕 ≥ 768px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.lg"
            label="屏幕 ≥ 992px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.xl"
            label="屏幕 ≥ 1200px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="all.xxl"
            label="屏幕 ≥ 1600px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item label="" name="all.wrap" valuePropName="checked">
            <CheckboxField tooltipTitle="是否自动换行" text="自动换行" />
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Form.Item
              label="单个布局"
              tooltip="屏幕 * 响应式栅格"
              labelCol={{ span: 16 }}
              name="single.span"
              className="mb-0"
            >
              <InputNumber className="w-100" min={0} max={24} />
            </Form.Item>
          }
          key="栅格占位数"
          className="site-collapse-custom-panel"
        >
          <Form.Item
            name="single.xs"
            label="屏幕 < 576px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="single.sm"
            label="屏幕 ≥ 576px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="single.md"
            label="屏幕 ≥ 768px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="single.lg"
            label="屏幕 ≥ 992px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="single.xl"
            label="屏幕 ≥ 1200px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
          <Form.Item
            name="single.xxl"
            label="屏幕 ≥ 1600px 响应式栅格"
            labelCol={{ span: 17 }}
          >
            <InputNumber className="w-100" min={0} max={24} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </Form>
  )
}
