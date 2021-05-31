/**
 * 根据模版生成list1组件的真实代码
 * @param params
 * @returns
 */
export function genrateList1(fields: any) {
  const renderFormItems = () => {
    let result = ''
    fields.forEach((item: any) => {
      result += `<Col {...colProps}>
            <Form.Item
              label={showLable && '${item.label}'}
              labelCol={{ span: 24 }}
              name={[name, '${item.field}']}
              fieldKey={[fieldKey, '${item.field}']}
              rules={${item.rules || '[]'}}
            >
              <${item.componentKey} />
            </Form.Item>
          </Col>\n`
    })
    return `<React.Fragment key={fieldKey}>\n${result}</React.Fragment>`
  }
  const gImport = () => {
    let result = 'Button, Form, Row, Col'
    fields.forEach((item: any) => {
      result += `, ${item.componentKey}`
    })
    return `import { ${result} } from 'antd'`
  }
  const gInitFieldValue = () => {
    const o = {} as any
    fields.forEach((item: any) => {
      o[item.field] = undefined
    })
    return o
  }

  return `
import * as React from 'react'
${gImport()}
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'

export interface IItem {
  label: string
  name?: string
  field: string
  componentKey: string
  rules?: { [key: string]: any }[]
}

interface IList1Props {
  name?: string // 表单数据字段名
  fields?: IItem[] // 每行元素
  form?: any // 每行元素
}

/**
 * list组件
 */
export default (props: IList1Props) => {
  const { name = 'demo', fields = [], form } = props
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

  const renderFormItems = (index: number, name: number, fieldKey: number) => {
    const showLable = index === 0
    return ${renderFormItems()}
  }

  useEffect(() => {
    form.setFieldsValue({
        [name]: [${JSON.stringify(gInitFieldValue())}]
    })
  }, [])

  return (
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name: _name, fieldKey, ...restField }, index) => {
              return (
                <Row key={key} gutter={15}>
                  {renderFormItems(index, _name, fieldKey)}
                  <Col span={operateCol}>
                    <Form.Item
                      labelCol={index === 0 ? { span: 24 } : undefined}
                      colon={false}
                      label={index === 0 ? <div></div> : undefined}
                    >
                      <DeleteOutlined onClick={() => remove(_name)} />
                      <CopyOutlined
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          // 获取当前行的默认值
                          const defaultValue =
                            form.getFieldsValue()?.[name]?.[index] || {}
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
  )
}
`
}
