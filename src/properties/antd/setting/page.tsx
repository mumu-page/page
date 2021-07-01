import React, { useCallback, useContext, useEffect } from 'react'
import { Form, InputNumber } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../constants'
import { Collapse, Title } from '../widgets'
import { debounce } from 'lodash'
import { Context, Utils } from '../../../stores'

const { refreshTarget } = Utils
export default function () {
  const [form] = Form.useForm()
  const { moveableOptions, setGlobal: commonDispatch } = useContext(Context)

  const onValuesChange = useCallback(
    debounce((_: any, allValues: any) => {
      const { width, height } = allValues
      const viewport =
        (document.querySelector('.viewport') as HTMLElement) || {}
      viewport.style.width = width + 'px'
      viewport.style.height = height + 'px'
      // 重新获取当前选中元素
      refreshTarget(moveableOptions?.target, commonDispatch)
    }, 500),
    []
  )

  useEffect(() => {
    const viewport = (document.querySelector('.viewport') as HTMLElement) || {}
    const { width, height } = viewport.style || {}
    form.setFieldsValue({
      width: parseInt(width),
      height: parseInt(height),
    })
  }, [])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Title text="尺寸" />
      <Collapse defaultActiveKey={['视窗大小']}>
        <Collapse.Panel header="视窗大小" key="视窗大小">
          <Form.Item label="宽度" name="width">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="高度" name="height">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </Form>
  )
}
