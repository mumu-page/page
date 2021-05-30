import * as React from 'react'
import * as Antd from 'antd' // 此处仅仅只是为了方便生成代码，开发者可以去掉改为按需引入
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { get } from 'lodash'

const { Form, Button, Row, Col, ...other } = Antd

/**
 * 此方法仅仅只是为了方便生成代码，开发者可以去掉自己实现
 * @param val
 * @returns
 */
function getComponent(val: string) {
  let Component
  if (!val) return <></>
  if (get(other, val)) {
    Component = get(other, val)
  } else {
    Component = <></>
  }
  return <Component />
}

export interface IItem {
  label: string
  name?: string
  field: string
  componentKey: string
  rules?: { [key: string]: any }[]
}

interface IList1Props {
  listName?: string // 表单数据字段名
  fields?: IItem[] // 每行元素
}

/**
 * 对应form-render list1
 * widget: 'list1' 用于展示每行只有 1-3 个简单元素的情况
 */
export default (props: IList1Props) => {
  const { listName = 'demo', fields = [] } = props
  const number = fields?.length || 0 // 每行元素个数
  const operateCol = 3 // 操作按钮格数
  const span = Math.floor((24 - operateCol) / number)
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

  const renderFormItems = (index: number, name: number, fieldKey: number) => {
    return fields.map((item) => {
      return (
        <Col key={fieldKey} {...colProps}>
          <Form.Item
            label={index === 0 ? item.label : undefined}
            labelCol={{ span: 24 }}
            name={[name, item.field]}
            fieldKey={[fieldKey, item.field]}
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
                  {renderFormItems(index, name, fieldKey)}
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
              <Col span={Math.floor(span * number)}>
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
