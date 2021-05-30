/**
 * 根据模版生成list1组件的真实代码
 * @param params
 * @returns
 */
export function genrateList1(fields: any) {
  const renderFormItems = () => {
    let result = ''
    fields.forEach((item: any) => {
      result += `<Col key={fieldKey} {...colProps}>
            <Form.Item
              label={showLable && '${item.label}'}
              labelCol={{ span: 24 }}
              name={[name, ${item.field}]}
              fieldKey={[fieldKey, ${item.field}]}
              rules={${item.rules || '[]'}}
            >
              <${item.componentKey} />
            </Form.Item>
          </Col>\n`
    })
    return `<>\n${result}</>`
  }
  return `
import * as React from 'react'
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'

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
 * list组件
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
    const showLable = index === 0
    return ${renderFormItems()}
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
`
}
