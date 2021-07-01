import React, { useEffect } from 'react'
import {
  Input,
  InputNumber,
  Select,
  Cascader,
  Radio,
  Checkbox,
  Switch,
  Slider,
  TimePicker,
  DatePicker,
  Rate,
  Upload,
  Button,
  Form,
  Col,
  Empty,
  Row,
} from 'antd'
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { get } from 'lodash'

const AntdForm = {
  Input,
  InputNumber,
  Select,
  Cascader,
  Radio,
  Checkbox,
  Switch,
  Slider,
  TimePicker,
  DatePicker,
  Rate,
  Upload,
}

/**
 * 此方法仅仅只是为了方便生成代码，开发者可以去掉自己实现
 * @param val
 * @returns
 */
function getComponent(val: string) {
  let Component
  if (!val) return <></>
  if (get(AntdForm, val)) {
    Component = get(AntdForm, val)
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
  name?: string // 表单数据字段名
  fields?: IItem[] // 每行元素
  form?: any
  design?: boolean // 是否是设计区渲染
}

/**
 * 对应form-render list1
 * widget: 'list1' 用于展示每行只有 1-3 个简单元素的情况
 */
export default (props: IList1Props) => {
  const { name = 'demo', fields: selfFields = [], design } = props
  let { form } = props
  const [_form] = Form.useForm()
  form = design ? _form : form
  const number = selfFields?.length || 0 // 每行元素个数
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

  // 并不希望程序中使用这样的代码，而是生成真实代码，更加灵活，从而应对需求复杂且多变的业务
  const renderFormItems = (index: number, name: number, fieldKey: number) => {
    return selfFields.map((item) => {
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

  useEffect(() => {
    form.setFieldsValue({
      [name]: [{}],
    })
  }, [])

  const result = (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name: _name, fieldKey }, index) => {
            if (!selfFields.length)
              return (
                <Empty
                  key={key}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="请在属性面板中设置字段"
                />
              )
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
          {selfFields.length ? (
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
          ) : null}
        </>
      )}
    </Form.List>
  )

  // 如果是设计区渲染，它需要一个独立form
  if (design) {
    return <Form form={form}>{result}</Form>
  }
  return result
}
