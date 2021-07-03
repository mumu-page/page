import React, { useContext, useState } from 'react'
import { Button, Col, Row } from 'antd'
import { IconFont, options } from '../../constants'
import { OptionGroup, OptionItem } from '../../typings/option'
import { Store, IFormComProp, Utils } from '@r-generate/core'
import { cloneDeep } from 'lodash'

const { shortid } = Utils
const { actionTypes, Hooks } = Store
const { useStore } = Hooks
const { PUT_COMPONENT_LIST } = actionTypes

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
  const { setGlobal: commonDispatch } = useStore()

  return (
    <>
      {newOptions.map((item) => {
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
            <Row gutter={[6, 6]} style={{ padding: '0 12px 12px 12px' }}>
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
                        style={{ backgroundColor: '#f8f8f8', fontSize: '12px' }}
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
                          commonDispatch({
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
      })}
    </>
  )
}
