import React from 'react'
import { Button, Col, Row, Switch, Input, Form, Empty } from 'antd'
import { IconFont, options } from '../../constants'
import { OptionGroup, OptionItem } from '../../typings/option'
import { Store, IFormComProp, Utils } from '@r-generator/core'
import { cloneDeep } from 'lodash'

const { shortid } = Utils
const { actionTypes, Hooks } = Store
const { useStore } = Hooks
const { PUT_COMPONENT_LIST, UPDATE_MODE } = actionTypes

const getNewOptions = (data: OptionGroup[]) => {
  return data.map((item) => {
    return {
      ...item,
      children: item?.children?.map((cItem) => {
        const { value, label, icon } = cItem || {}
        const id = shortid()
        const ret: IFormComProp & OptionItem = {
          value,
          label,
          icon,
          id,
          key: id,
          componentKey: value,
          formItemProps: {
            name: id,
            label,
          },
          colProps: {},
          rowProps: {},
          componentProps: {},
          layout: {
            frame: { translate: [0, 0] },
          },
        }
        if (['List1'].includes(value)) {
          ret.colProps = {
            lg: 24,
            md: 24,
            sm: 24,
            xl: 24,
            xs: 24,
            xxl: 24,
          }
          ret.formItemProps.labelCol = { span: 24 }
        }
        return ret
      }),
    }
  })
}

const newOptions = getNewOptions(options)
export default () => {
  const { setGlobal, mode } = useStore()

  const onSearch = (value: string) => console.log(value)

  const renderBody = () => {
    if (mode !== 'form') {
      return (
        <div className="p-10">
          <Empty description="非表单设计，敬请期待..." />
        </div>
      )
    }
    return newOptions.map((item) => {
      return (
        <div key={item.key}>
          <Button
            className="title-btn"
            style={{ paddingLeft: 12 }}
            icon={<IconFont type={item.icon} />}
            type="text"
            disabled
          >
            {item.label}
          </Button>
          <Row gutter={[6, 6]}>
            {item.children &&
              item.children.map((childItem) => {
                return (
                  <Col
                    span={12}
                    key={childItem.value}
                    className="left-sidebar-col"
                  >
                    <Button
                      block
                      style={{
                        backgroundColor: '#f8f8f8',
                        fontSize: '12px',
                      }}
                      type="default"
                      icon={<IconFont type={childItem.icon} />}
                      onClick={() => {
                        const id = shortid()
                        //   console.log(childItem)
                        const _childItem = cloneDeep(childItem)
                        //   console.log(id)
                        _childItem.id = id
                        _childItem.key = id
                        if (_childItem.formItemProps?.name) {
                          _childItem.formItemProps.name = id
                        }
                        //   console.log(_childItem)
                        setGlobal({
                          type: PUT_COMPONENT_LIST,
                          payload: _childItem,
                        })
                      }}
                    >
                      {childItem.label}
                    </Button>
                  </Col>
                )
              })}
          </Row>
        </div>
      )
    })
  }

  return (
    <div className="left-sidebar">
      <div className="header">
        <Input.Search
          placeholder="请输入组件名称"
          enterButton="搜索"
          // size="large"
          onSearch={onSearch}
        />
        <div className="mode-switch">
          <Form.Item style={{ marginBottom: 0 }} label="模式切换">
            <Switch
              checkedChildren="表单设计"
              unCheckedChildren="非表单设计"
              checked={mode === 'form'}
              onChange={(val) => {
                setGlobal({
                  type: UPDATE_MODE,
                  payload: {
                    mode: val ? 'form' : 'page',
                  },
                })
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="body">{renderBody()}</div>
    </div>
  )
}
