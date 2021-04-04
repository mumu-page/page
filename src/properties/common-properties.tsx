import React, { useEffect, useContext, memo, useCallback } from 'react'
import { Form, Input, InputNumber, Radio, Select } from 'antd'
import { Context } from '../stores/context'
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from '../stores/action-type'
import { isDatePickerRange } from '../utils/utils'
import { options } from '../constants'
import { FORM_PROPERTIES_OPTIONS } from '../constants/constants'
import { IComponentKeys } from '../stores/typings'
import CheckboxField from '../components/FormFields/CheckboxField'
import { CustomCollapse, Title } from '../components'
import { debounce } from 'lodash'
import { refreshTarget } from '../utils/utils'

const { Option, OptGroup } = Select

interface FormData {
  componentKey: IComponentKeys
  componentWidth: string
  bordered: boolean
  placeholder: string | string[]
  [key: string]: any
}

/**
 * 组件的公共属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>()
  const {
    target: currentDragComponent,
    moveableOptions,
    commonDispatch,
  } = useContext(Context)
  const { id, componentProps = {} } = currentDragComponent || {}

  const onValuesChange = useCallback(
    debounce(
      (
        { componentWidth: cw, placeholder: p, placeholder1, placeholder2 }: any,
        allValues: FormData
      ) => {
        const { componentKey } = allValues
        // 如果是日期范围类控件，设置placeholder为数组
        if (isDatePickerRange(currentDragComponent?.componentKey)) {
          allValues.placeholder = [
            allValues.placeholder1,
            allValues.placeholder2,
          ]
        }
        const { placeholder, componentWidth, bordered } = allValues
        const style = {} as any
        if (typeof componentWidth === 'number') {
          style.width = componentWidth + '%'
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
                bordered,
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
              componentKey,
              placeholder,
              style,
              bordered,
            },
          },
        })
        refreshTarget(moveableOptions?.target, commonDispatch)
      },
      100
    ),
    [currentDragComponent]
  )

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
          checked: true,
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Title text="通用" />
        <CustomCollapse defaultActiveKey={['控件类型']}>
          <CustomCollapse.Panel header="控件类型" key="控件类型">
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
          </CustomCollapse.Panel>
          <CustomCollapse.Panel
            header={
              <Form.Item
                label="控件宽度"
                name="componentWidth"
                tooltip="请输入百分比"
                className="mb-0"
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            }
          >
            <Form.Item label="" valuePropName="checked" name="bordered">
              <CheckboxField tooltipTitle="是否有边框" text="显示边框" />
            </Form.Item>
          </CustomCollapse.Panel>
          <CustomCollapse.Panel header="占位提示" key="占位提示">
            {isDatePickerRange(currentDragComponent?.componentKey) ? (
              <>
                <Form.Item label="" name="placeholder1">
                  <Input />
                </Form.Item>
                <Form.Item label="" name="placeholder2">
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item label="" name="placeholder">
                <Input />
              </Form.Item>
            )}
          </CustomCollapse.Panel>
          <CustomCollapse.Panel header="大小" key="大小">
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
          </CustomCollapse.Panel>
        </CustomCollapse>
      </Form>
    </>
  )
})
