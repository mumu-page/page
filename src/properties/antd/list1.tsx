import React, { useEffect, useContext, memo } from 'react'
import { Form, Button, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Context } from '../../stores/context'
import { options } from '../../constants/options'
import { FORM_PROPERTIES_OPTIONS } from '../../constants/constants'
import { IComponentKeys } from '../../stores/typings'
import { CustomCollapse } from '../../components'

const { Option, OptGroup } = Select

interface FormData {
  componentKey: IComponentKeys
  componentWidth: string
  bordered: boolean
  placeholder: string | string[]
  [key: string]: any
}

/**
 * list1属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>()
  const {
    target: currentDragComponent,
    moveableOptions,
    setGlobal: commonDispatch,
  } = useContext(Context)
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
  }

  const add = () => {
      
  }

  useEffect(() => {}, [currentDragComponent?.id])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      initialValues={{
        size: 'middle',
        bordered: true,
      }}
      form={form}
      onValuesChange={onValuesChange}
    >
      <CustomCollapse defaultActiveKey={['设置每项元素']}>
        <CustomCollapse.Panel header="设置每项元素" key="设置每项元素">
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
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              新增一条
            </Button>
          </Form.Item>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  )
})
