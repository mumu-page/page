import React, { useRef } from 'react'
import { Button, Form, Radio } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../constants'
import { Collapse, IRefType, OptionSet } from '../../../components'

export default function () {
  const modalRef = useRef<IRefType>(null)
  const [form] = Form.useForm()

  const showModal = () => {
    const options = form.getFieldValue('options')
    if (form.getFieldValue('options')) {
      modalRef.current?.setdataSource(options)
    }
    modalRef.current?.showModal()
  }

  const onValuesChange = (_: any, allValues: any) => {}

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{
        size: 'middle',
      }}
    >
      <Collapse defaultActiveKey={['下拉列表']}>
        <Collapse.Panel header="下拉列表" key="下拉列表">
          <Form.Item label="列表内选项" name="options">
            <Button type="dashed" block onClick={showModal}>
              配置数据
            </Button>
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel header="选择框" key="选择框">
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
        </Collapse.Panel>
      </Collapse>

      <OptionSet
        ref={modalRef}
        onOk={(options: any) => {
          form.setFieldsValue({
            options,
          })
        }}
      />
    </Form>
  )
}
