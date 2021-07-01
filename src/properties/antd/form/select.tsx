import React, { useContext, useEffect, useRef } from 'react'
import { Button, Form } from 'antd'
import { FORM_PROPERTIES_OPTIONS } from '../constants'
import { Collapse, IRefType, OptionSet } from '../widgets'
import { actionTypes, Context } from '../../../stores'
const { SET_TARGET, UPDATE_COMPONENT_LIST_BY_TARGET } = actionTypes

export default function () {
  const { target: currentDragComponent, setGlobal: commonDispatch } =
    useContext(Context)
  const modalRef = useRef<IRefType>(null)
  const [form] = Form.useForm()
  const { id, componentProps = {} } = currentDragComponent || {}

  const showModal = () => {
    const options = form.getFieldValue('options')
    if (options) {
      modalRef.current?.setdataSource(options)
    }
    modalRef.current?.showModal()
  }

  useEffect(() => {
    form.setFieldsValue({ options: componentProps.options })
  }, [componentProps.id])

  return (
    <Form {...FORM_PROPERTIES_OPTIONS} form={form}>
      <Collapse defaultActiveKey={['下拉列表']}>
        <Collapse.Panel header="下拉列表" key="下拉列表">
          <Form.Item label="列表内选项" name="options" shouldUpdate>
            <Button type="dashed" block onClick={showModal}>
              {form.getFieldValue('options')?.length ? `已配置` : '配置数据'}
            </Button>
          </Form.Item>
        </Collapse.Panel>
      </Collapse>

      <OptionSet
        ref={modalRef}
        onOk={(options: any) => {
          form.setFieldsValue({
            options,
          })
          commonDispatch({
            type: SET_TARGET,
            payload: {
              id,
              componentProps: { options },
            },
          })
          commonDispatch({
            type: UPDATE_COMPONENT_LIST_BY_TARGET,
            payload: {
              id,
              data: {
                componentProps: { options },
              },
            },
          })
        }}
      />
    </Form>
  )
}
