import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Checkbox,
  Tooltip,
  Typography,
} from 'antd'
import { Context } from '../stores/context'
import {
  UPDATE_COMPONENT_LIST_BY_TARGET,
  SET_TARGET,
} from '../stores/action-type'
import { SelectOutlined, DeleteOutlined } from '@ant-design/icons'
import { CustomCollapse, IconModal, IconModalInstanceProp } from '../components'
import { FORM_PROPERTIES_OPTIONS } from '../constants/constants'
import { debounce } from 'lodash'

type IIconType = 'prefix' | 'suffix'

export default () => {
  const [form] = Form.useForm()
  const iconModal = useRef<IconModalInstanceProp>(null)
  const { target: currentDragComponent, commonDispatch } = useContext(Context)
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
        <CustomCollapse defaultActiveKey={['输入框属性']}>
          <CustomCollapse.Panel header="输入框属性" key="输入框属性">
            <Form.Item label="默认值" name="defaultValue">
              <Input />
            </Form.Item>
            <Form.Item
              label="前置标签"
              tooltip="带标签的 input，设置前置标签"
              name="addonBefore"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="后置标签"
              tooltip="带标签的 input，设置后置标签"
              name="addonAfter"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="前缀图标"
              tooltip="带有前缀图标的 input"
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
              label="后缀图标"
              tooltip="带有后缀图标的 input"
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
            <Form.Item label="最大长度" name="maxLength">
              <InputNumber />
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="allowClear">
              <Checkbox>
                <Tooltip title="可以点击清除图标删除内容">支持清除</Tooltip>
              </Checkbox>
            </Form.Item>
            <Form.Item label="" valuePropName="checked" name="disabled">
              <Checkbox>
                <Tooltip title="是否禁用状态，默认为 false">禁用</Tooltip>
              </Checkbox>
            </Form.Item>
          </CustomCollapse.Panel>
        </CustomCollapse>
      </Form>
    </>
  )
}
