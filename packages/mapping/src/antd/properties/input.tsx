import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Form, Input, InputNumber, Checkbox, Tooltip, Typography } from 'antd'
import {
  UPDATE_COMPONENT_LIST_BY_TARGET,
  SET_TARGET,
  useStore,
} from '@r-generator/stores'
import { SelectOutlined, DeleteOutlined } from '@ant-design/icons'
import { IconModal, IconModalInstanceProp, Collapse } from '../../components'
import { FORM_PROPERTIES_OPTIONS } from '../../constants'
import { debounce } from 'lodash'

type IIconType = 'prefix' | 'suffix'

export default () => {
  const [form] = Form.useForm()
  const iconModal = useRef<IconModalInstanceProp>(null)
  const { target: currentDragComponent, setGlobal: commonDispatch } = useStore()
  const { id, componentProps = {} } = currentDragComponent || {}
  const [iconType, setIconType] = useState<IIconType>('prefix')

  const onValuesChange = useCallback(
    debounce((changedValues: any, allValues: any) => {
      commonDispatch({
        type: SET_TARGET,
        payload: {
          id,
          componentProps: allValues,
        },
      })
      commonDispatch({
        type: UPDATE_COMPONENT_LIST_BY_TARGET,
        payload: {
          id,
          data: {
            componentProps: allValues,
          },
        },
      })
    }, 100),
    [currentDragComponent]
  )

  const setPrefix = () => {
    iconModal.current?.show()
    setIconType('prefix')
  }

  const setSuffix = () => {
    iconModal.current?.show()
    setIconType('suffix')
  }

  const updateIcon = (iconKey: string | null) => {
    commonDispatch({
      type: SET_TARGET,
      payload: {
        id,
        componentProps: {
          [iconType]: iconKey,
        },
      },
    })
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_TARGET,
      payload: {
        id,
        data: {
          componentProps: {
            [iconType]: iconKey,
          },
        },
      },
    })
    form.setFieldsValue({
      [iconType]: iconKey,
    })
  }

  const onOk = (iconKey: string) => {
    updateIcon(iconKey)
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(componentProps)
  }, [currentDragComponent?.id])

  return (
    <>
      <IconModal ref={iconModal} onOk={onOk} />
      <Form
        {...FORM_PROPERTIES_OPTIONS}
        initialValues={{
          bordered: true,
          disabled: false,
          size: 'middle',
        }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Collapse defaultActiveKey={['???????????????']}>
          <Collapse.Panel header="???????????????" key="???????????????">
            <Form.Item label="?????????" name="defaultValue">
              <Input />
            </Form.Item>
            <Form.Item
              label="????????????"
              tooltip="???????????? input?????????????????????"
              name="addonBefore"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="????????????"
              tooltip="???????????? input?????????????????????"
              name="addonAfter"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="????????????"
              tooltip="????????????????????? input"
              name="prefix"
            >
              <Input
                readOnly
                addonBefore={
                  <Typography.Link onClick={setPrefix}>
                    <SelectOutlined />
                  </Typography.Link>
                }
                addonAfter={
                  <Typography.Link
                    onClick={() => {
                      setIconType('prefix')
                      updateIcon(null)
                    }}
                  >
                    <DeleteOutlined style={{ color: 'red' }} />
                  </Typography.Link>
                }
              />
            </Form.Item>
            <Form.Item
              label="????????????"
              tooltip="????????????????????? input"
              name="suffix"
            >
              <Input
                readOnly
                addonBefore={
                  <Typography.Link onClick={setSuffix}>
                    <SelectOutlined />
                  </Typography.Link>
                }
                addonAfter={
                  <Typography.Link
                    onClick={() => {
                      setIconType('suffix')
                      updateIcon(null)
                    }}
                  >
                    <DeleteOutlined style={{ color: 'red' }} />
                  </Typography.Link>
                }
              />
            </Form.Item>
            <Form.Item label="????????????" name="maxLength">
              <InputNumber />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="allowClear">
              <Checkbox>
                <Tooltip title="????????????????????????????????????">????????????</Tooltip>
              </Checkbox>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="disabled">
              <Checkbox>
                <Tooltip title="?????????????????????????????? false">??????</Tooltip>
              </Checkbox>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  )
}
