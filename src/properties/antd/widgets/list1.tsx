import * as React from 'react'
import { Form, Button, Row, Col } from 'antd'
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { IComponentKeys } from '../../../stores/typings'
import { getComponent } from '../key2Component'

interface IItem {
  label: string
  name: string
  fieldKey: string
  componentKey: IComponentKeys
  rules: { [key: string]: any }[]
}

interface IList1Props {
  listName?: string // 表单数据字段名
  list?: IItem[] // 每行元素
}

const mockList: IItem[] = [
  {
    label: '默认元素1',
    name: 'demo1',
    fieldKey: 'demo1',
    componentKey: 'Input',
    rules: [{ required: true, message: 'Missing last name' }],
  },
  {
    label: '默认元素2',
    name: 'demo2',
    fieldKey: 'demo2',
    componentKey: 'Input',
    rules: [{ required: true, message: 'Missing last name' }],
  },
  {
    label: '默认元素3',
    name: 'demo3',
    fieldKey: 'demo3',
    componentKey: 'Input',
    rules: [{ required: true, message: 'Missing last name' }],
  },
  {
    label: '默认元素4',
    name: 'demo4',
    fieldKey: 'demo4',
    componentKey: 'Input',
    rules: [{ required: true, message: 'Missing last name' }],
  },
]

/**
 * 对应form-render list1
 * widget: 'list1' 用于展示每行只有 1-3 个简单元素的情况
 */
export default (props: IList1Props) => {
  const { listName = 'demo', list = mockList } = props
  const number = list?.length || 0 // 每行元素个数
  const operateCol = 2 // 操作按钮格数
  const span = parseInt(`${(24 - operateCol) / number}`)
  const colProps = {
    lg: span,
    md: span,
    sm: span,
    xl: span,
    xs: span,
    xxl: span,
  }
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    console.log('Received values of form:', values)
  }

  const renderFormItems = (
    index: number,
    name: number,
    fieldKey: number,
    restField: { [key: string]: any }
  ) => {
    return list.map((item) => {
      return (
        <Col key={fieldKey} {...colProps}>
          <Form.Item
            {...restField}
            label={index === 0 ? item.label : undefined}
            labelCol={{ span: 24 }}
            name={[name, item.name]}
            fieldKey={[fieldKey, item.fieldKey]}
            rules={item.rules}
          >
            {getComponent(item.componentKey)}
          </Form.Item>
        </Col>
      )
    })
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.List name={listName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => {
              return (
                <Row key={key} gutter={15}>
                  {renderFormItems(index, name, fieldKey, restField)}
                  <Col span={operateCol}>
                    <Form.Item
                      labelCol={index === 0 ? { span: 24 } : undefined}
                      colon={false}
                      label={index === 0 ? <div></div> : undefined}
                    >
                      <DeleteOutlined onClick={() => remove(name)} />
                      <CopyOutlined
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          // 获取当前行的默认值
                          const defaultValue =
                            form.getFieldsValue()?.[listName]?.[index] || {}
                          add(defaultValue)
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )
            })}
            <Row>
              <Col span={parseInt(`${span * number}`)}>
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
              </Col>
            </Row>
          </>
        )}
      </Form.List>
    </Form>
  )
}
