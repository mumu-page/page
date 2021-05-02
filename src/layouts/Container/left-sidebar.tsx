import React, { useContext, useState } from 'react'
import { Button, Col, Row } from 'antd'
import { IconFont, options } from '../../constants'
import { OptionGroup, OptionItem } from '../../typings/option'
import { hasNotPlaceholder, isSelect } from '../../utils/utils'
import { IFormComProp } from '../../stores/typings'
import { PUT_COMPONENT_LIST } from '../../stores/action-type'
import { shortid } from '../../utils/utils'
import { cloneDeep } from 'lodash'
import { useStore } from '../../hooks'

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
        if (!hasNotPlaceholder(value)) {
          const placeholderEnum: any = {
            'TimePicker.RangePicker': ['开始时间', '结束时间'],
            'DatePicker.RangePicker': ['开始日期', '结束日期'],
          }
          if (isSelect(value)) {
            ret.componentProps.placeholder =
              placeholderEnum[value] || '请选择' + label
          } else {
            ret.componentProps.placeholder = '请输入' + label
          }
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
