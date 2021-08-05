import React, { useEffect, memo } from 'react'
import { Form, Input, InputNumber, Radio, Select } from 'antd'
import {
  refreshTarget,
  IComponentKeys,
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
  useStore,
} from '@r-generator/stores'
import { options, FORM_PROPERTIES_OPTIONS } from '../constants'
import { Collapse, Title, CheckboxField } from '../../../components'

const { Option, OptGroup } = Select

function isDatePickerRange(componentKey: string) {
  return ['TimePicker.RangePicker', 'DatePicker.RangePicker'].includes(
    componentKey
  )
}

interface FormData {
  componentKey: IComponentKeys
  componentWidth: string
  bordered: boolean
  placeholder: string | string[]
  [key: string]: any
}

/**
 * 公共属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>()
  const {
    target: currentDragComponent,
    moveableOptions,
    setGlobal: commonDispatch,
  } = useStore()
  const { id, componentProps = {} } = currentDragComponent || {}

  const onValuesChange = (
    { componentWidth: cw, placeholder: p, placeholder1, placeholder2 }: any,
    allValues: FormData
  ) => {
    const {
      componentKey,
      placeholder: originalPlaceholder,
      componentWidth,
      ...otherProp
    } = allValues
    let placeholder = originalPlaceholder
    // 如果是日期范围类控件，设置placeholder为数组
    if (isDatePickerRange(currentDragComponent?.componentKey)) {
      placeholder = [allValues.placeholder1, allValues.placeholder2]
    }
    let style = { width: componentWidth }
    if (typeof componentWidth === 'number') {
      style.width += '%'
    }
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_TARGET,
      payload: {
        data: {
          componentKey,
          value: componentKey,
          componentProps: {
            placeholder,
            style,
            ...otherProp,
          },
        },
      },
    })
    commonDispatch({
      type: SET_TARGET,
      payload: {
        id,
        componentKey,
        value: componentKey,
        componentProps: {
          placeholder,
          style,
          ...otherProp,
        },
      },
    })
    refreshTarget(moveableOptions?.target, commonDispatch)
  }

  const updateFormVal = () => {
    const { style = {}, placeholder, ...other } = componentProps || {}
    const width = style?.width?.replace('%', '')?.replace(/null|undefined/, '')
    let placeholder1
    let placeholder2
    if (Array.isArray(placeholder)) {
      placeholder1 = placeholder[0]
      placeholder2 = placeholder[1]
    }
    form.resetFields()
    form.setFieldsValue({
      ...other,
      componentKey: currentDragComponent.componentKey,
      componentWidth: width,
      placeholder,
      placeholder1,
      placeholder2,
    })
  }

  useEffect(() => {
    updateFormVal()
  }, [currentDragComponent?.id])

  return (
    <>
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        initialValues={{
          size: 'middle',
          bordered: true,
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Title text="通用" />
        <Collapse defaultActiveKey={['通用']}>
          <Collapse.Panel header="通用" key="通用">
            <Form.Item label="" name="componentKey">
              <Select>
                {options.map((item) => {
                  return (
                    <OptGroup label={item.label} key={item.key}>
                      {Array.isArray(item.children) &&
                        item.children.map((childItem) => {
                          return (
                            <Option key={childItem.key} value={childItem.value}>
                              {childItem.label}
                            </Option>
                          )
                        })}
                    </OptGroup>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="控件宽度"
              name="componentWidth"
              tooltip="请输入百分比"
              className="mb-0"
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
            {isDatePickerRange(currentDragComponent?.componentKey) ? (
              <>
                <Form.Item label="占位符1" name="placeholder1">
                  <Input />
                </Form.Item>
                <Form.Item label="占位符2" name="placeholder2">
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item label="占位符" name="placeholder">
                <Input />
              </Form.Item>
            )}
            <Form.Item label="大小" name="size">
              <Radio.Group style={{ width: '100%' }}>
                <Radio.Button
                  value="large"
                  style={{ width: '33.3%', textAlign: 'center' }}
                >
                  大
                </Radio.Button>
                <Radio.Button
                  value="middle"
                  style={{ width: '33.3%', textAlign: 'center' }}
                >
                  中
                </Radio.Button>
                <Radio.Button
                  value="small"
                  style={{ width: '33.3%', textAlign: 'center' }}
                >
                  小
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="bordered">
              <CheckboxField tooltipTitle="是否有边框" text="显示边框" />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="disabled">
              <CheckboxField tooltipTitle="是否禁用" text="是否禁用" />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  )
})
