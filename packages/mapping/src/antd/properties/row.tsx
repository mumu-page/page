import React, { useCallback, useEffect, useState } from 'react'
import {
  Form,
  Select,
  InputNumber,
  Typography,
  Switch,
  Space,
  Empty,
} from 'antd'
import {
  RESET_COMPONENT_LAYOUT,
  useStore,
  refreshTarget,
  SET_GLOBAL,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  SET_TARGET,
} from '@r-generator/stores'
import { FORM_PROPERTIES_OPTIONS } from '../../constants'
import { CheckboxField, Collapse, Title } from '../../components'
import { debounce, merge } from 'lodash'

/**
 * 根据列数获取布局参数
 * @param colNum
 * @param row
 * @returns
 */
function genLayout(colNum: 1 | 2 | 3 | 4, row = 24) {
  if (isNaN(Number(colNum))) {
    colNum = 1
  }
  const col = Math.floor(Number(row / colNum))
  return {
    xs: col,
    sm: col,
    md: col,
    lg: col,
    xl: col,
    xxl: col,
  }
}

/**
 * 布局增加精简模式和复杂模式
 * 精简模式：支持设置 几列布局等 比如：2列  3列  那么界面会自动适配
 * 专业模式：支持精准设置多种属性，适用于专业人员。
 */
export default function () {
  const [form] = Form.useForm()
  const { target, moveableOptions, setGlobal, layoutType, commonProps } =
    useStore()
  const [mode, setMode] = useState<'专业模式' | '精简模式'>('精简模式')

  const onValuesChange = useCallback(
    debounce((_changedValues: any, allValues: any) => {
      let newAllValues = allValues
      if (!newAllValues.gutter) newAllValues.gutter = 0
      if (mode === '精简模式') {
        newAllValues = merge(allValues, genLayout(allValues.colNum))
        // 重置layout属性
        setGlobal({
          type: RESET_COMPONENT_LAYOUT,
        })
      }
      const { align, colNum, gutter, justify, wrap, ...col } = newAllValues
      // 更新当前组件
      setGlobal({
        type: SET_GLOBAL,
        payload: {
          commonProps: {
            ...commonProps,
            layout: {
              row: {
                align,
                gutter,
                justify,
                wrap,
                colNum,
              },
              col,
            },
          },
        },
      })
      // 重新获取当前选中元素
      refreshTarget(moveableOptions.target, setGlobal)
    }, 200),
    [commonProps, mode]
  )

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(commonProps?.layout?.row)
  }, [commonProps?.layout?.row])

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
      <Title
        text="布局"
        extra={
          <Space>
            <Typography.Link
              onClick={() => {
                setGlobal({
                  type: SET_GLOBAL,
                  payload: {
                    layoutType:
                      layoutType === 'flexible' ? 'mobility' : 'flexible',
                  },
                })
              }}
            >
              <Switch
                checkedChildren="弹性布局"
                unCheckedChildren="流动布局"
                checked={layoutType === 'flexible'}
              />
            </Typography.Link>
            {layoutType === 'flexible' && (
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
            )}
          </Space>
        }
      />
      <Collapse
        defaultActiveKey={[layoutType === 'flexible' ? '弹性布局' : '流动布局']}
      >
        {layoutType === 'flexible' && (
          <Collapse.Panel
            header={
              <Form.Item
                label="弹性布局"
                tooltip="在此设置的内容将应用于全部控件"
                className="mb-0 w-100"
              ></Form.Item>
            }
            key={'弹性布局'}
          >
            <Form.Item label="垂直对齐" name="align">
              <Select>
                <Select.Option value="top">靠上</Select.Option>
                <Select.Option value="middle">居中</Select.Option>
                <Select.Option value="bottom">靠下</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="水平排列" name="justify">
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
            {mode === '精简模式' && (
              <>
                <Form.Item label="列数" name="colNum">
                  <Select>
                    <Select.Option value="1">一列</Select.Option>
                    <Select.Option value="2">二列</Select.Option>
                    <Select.Option value="3">三列</Select.Option>
                    <Select.Option value="4">四列</Select.Option>
                  </Select>
                </Form.Item>
              </>
            )}
            {mode === '专业模式' && (
              <>
                <Form.Item
                  label="屏幕 * 响应式栅格"
                  labelCol={{ span: 17 }}
                  name="span"
                >
                  <InputNumber className="w-100" min={0} max={24} />
                </Form.Item>
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
            <Form.Item label="栅格间隔" name="gutter" labelCol={{ span: 17 }}>
              <InputNumber className="w-100" min={0} max={100} />
            </Form.Item>
            <Form.Item label="" name="wrap" valuePropName="checked">
              <CheckboxField tooltipTitle="是否自动换行" text="自动换行" />
            </Form.Item>
          </Collapse.Panel>
        )}
        {layoutType === 'mobility' && (
          <Collapse.Panel
            header={
              <Form.Item
                label="流动布局"
                tooltip="在此设置的内容将应用于全部控件"
                className="mb-0 w-100"
              ></Form.Item>
            }
            key={'流动布局'}
          >
            <Empty description="暂时没有需要设置的内容" />
          </Collapse.Panel>
        )}
        <Collapse.Panel
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
                    setGlobal({
                      type: UPDATE_COMPONENT_LIST_BY_TARGET,
                      payload: {
                        id: target.id,
                        data: {
                          colProps: newData,
                        },
                      },
                    })
                    // 更新当前组件
                    setGlobal({
                      type: SET_TARGET,
                      payload: {
                        id: target.id,
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
        </Collapse.Panel>
      </Collapse>
    </Form>
  )
}
