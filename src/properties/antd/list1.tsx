import React, { useEffect, memo } from 'react'
import { Form, Button, Select, Row, Col, Popover, Input, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { options } from '../../constants/options'
import { FORM_PROPERTIES_OPTIONS } from '../../constants/constants'
import { CustomCollapse } from '../../components'
import { useStore } from '../../hooks'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { shortid } from '../../utils/utils'
import {
  SET_TARGET,
  UPDATE_COMPONENT_LIST_BY_TARGET,
} from '../../stores/action-type'

const { Option, OptGroup } = Select

interface FormData {
  fields: {
    label: string
    field: string
    componentKey: string
  }[]
  [key: string]: any
}

const formatValue = (allValues: any) => {
  return (allValues.fields = allValues?.fields?.filter(
    (item: any) => item.field
  ))
}

/**
 * list1属性设置
 */
export default memo(function () {
  const [form] = Form.useForm<FormData>()
  const { target: currentDragComponent, setGlobal: commonDispatch } = useStore()

  const update = (allValues: FormData) => {
    commonDispatch({
      type: SET_TARGET,
      payload: {
        id: currentDragComponent?.id,
        componentProps: allValues,
      },
    })
    commonDispatch({
      type: UPDATE_COMPONENT_LIST_BY_TARGET,
      payload: {
        id: currentDragComponent?.id,
        data: {
          componentProps: allValues,
        },
      },
    })
  }

  const onValuesChange = (_changeValues: any, allValues: any) => {
    // console.log(_changeValues, allValues)
    // allValues中数组删除的项没有被清除，这里做一下处理 把空值删除掉
    allValues.fields = formatValue(allValues)
    update(allValues)
  }

  const renderFormItems = ({
    index,
    name,
    fieldKey,
    remove,
    add,
  }: {
    index: number
    name: number
    fieldKey: number
    remove: (index: number | number[]) => void
    add: (defaultValue?: any, insertIndex?: number | undefined) => void
  }) => {
    const formValues = form.getFieldsValue()
    const listValue = formValues.fields || []
    const current = listValue[index] || {}
    const setValue = (key: string, value: string) => {
      ;(listValue as any[])[index][key] = value
      form.setFieldsValue({
        fields: listValue,
      })
      update(formValues)
    }

    const label = (
      <Popover
        trigger="click"
        placement="topLeft"
        getPopupContainer={() => {
          return document.querySelector('.form-properties') || document.body
        }}
        content={
          <div>
            <Form.Item
              label="名称"
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 5 }}
            >
              <Input
                defaultValue={current.label}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('label', value)
                }}
              />
            </Form.Item>
            <Form.Item
              label="字段名"
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 5 }}
            >
              <Input
                defaultValue={current.field}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('field', value)
                }}
              />
            </Form.Item>
          </div>
        }
        title={
          <Row justify="space-between">
            <Col>编辑控件属性</Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  disabled={canAdd()}
                  icon={
                    <CopyOutlined
                      onClick={() => {
                        // 获取当前行的默认值
                        const defaultValue =
                          form.getFieldsValue()?.fields?.[index] || {}
                        add(defaultValue)
                      }}
                    />
                  }
                ></Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined onClick={() => remove(name)} />}
                ></Button>
              </Space>
            </Col>
          </Row>
        }
      >
        {current.label}
      </Popover>
    )
    return (
      <Form.Item
        tooltip="点击标签可以设置属性"
        label={label}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        name={[name, 'componentKey']}
        fieldKey={[fieldKey, 'componentKey']}
      >
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
    )
  }

  const canAdd = () => formatValue(form.getFieldsValue())?.length === 4

  useEffect(() => {
    form.setFieldsValue({
      fields: currentDragComponent?.componentProps?.fields || [],
    })
  }, [currentDragComponent?.id])

  return (
    <Form
      {...FORM_PROPERTIES_OPTIONS}
      form={form}
      onValuesChange={onValuesChange}
    >
      <CustomCollapse defaultActiveKey={['设置列表每项元素']}>
        <CustomCollapse.Panel header="设置列表每项元素" key="设置列表每项元素">
          <Form.List name="fields" prefixCls="111">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name, fieldKey }, index) => {
                  return (
                    <React.Fragment key={fieldKey}>
                      <Form.Item
                        hidden
                        name={[name, 'label']}
                        fieldKey={[fieldKey, 'label']}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        hidden
                        name={[name, 'field']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                      {renderFormItems({
                        index,
                        name,
                        fieldKey,
                        remove,
                        add,
                      })}
                    </React.Fragment>
                  )
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({
                        label: '标签名',
                        field: shortid(),
                      })
                    }}
                    block
                    icon={<PlusOutlined />}
                    disabled={canAdd()}
                  >
                    {canAdd() ? '最多添加4项' : '新增一条'}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </CustomCollapse.Panel>
      </CustomCollapse>
    </Form>
  )
})
