import React, { forwardRef, useState } from 'react'
import { Switch, Input, Form, Empty, RowProps, Typography } from 'antd'
import { FormOption, OptionItem, formOptions } from '../../constants'
import { shortid } from '@r-generator/shared'
import {
  useStore,
  IFormComProp,
  PUT_COMPONENT_LIST,
  UPDATE_MODE,
} from '@r-generator/stores'
import { cloneDeep } from 'lodash'
import { ReactSortable } from 'react-sortablejs'

const gFormOptions = (data: FormOption[]) => {
  return data.map((item) => {
    return {
      ...item,
      children: item?.children?.map((cItem) => {
        const { value, label } = cItem || {}
        const id = shortid()
        const ret: IFormComProp & OptionItem = {
          value,
          label,
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

const newOptions = gFormOptions(formOptions)

const RowWrap = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  return <div {...props} ref={ref} className="component-list" />
})

export default () => {
  const { setGlobal, mode } = useStore()
  const [list, serList] = useState(newOptions)

  const onSearch = (value: string) => {
    console.log(value)
  }

  const renderFormPool = () => {
    return (
      <>
        <Typography.Title level={4} style={{ marginTop: '0.5em' }}>
          <Typography.Text type="secondary">表单组件</Typography.Text>
        </Typography.Title>
        {list.map((item) => {
          return (
            <div key={item.key}>
              <Typography.Title level={5} style={{ marginTop: '0.5em' }}>
                <Typography.Text type="secondary">{item.label}</Typography.Text>
              </Typography.Title>
              <ReactSortable
                group={{
                  name: 'AssembleArea',
                  pull: 'clone',
                  put: false,
                  revertClone: true,
                }}
                sort={false}
                tag={RowWrap}
                list={item.children}
                setList={(_newState) => {}}
                animation={200}
                delayOnTouchOnly
                onEnd={() => {
                  serList(gFormOptions(list))
                }}
              >
                {item.children &&
                  item.children.map((childItem) => {
                    return (
                      <div
                        key={childItem.value}
                        className="component-item"
                        onClick={() => {
                          const id = shortid()
                          const _childItem = cloneDeep(childItem)
                          _childItem.id = id
                          _childItem.key = id
                          if (_childItem.formItemProps?.name) {
                            _childItem.formItemProps.name = id
                          }
                          setGlobal({
                            type: PUT_COMPONENT_LIST,
                            payload: _childItem,
                          })
                        }}
                      >
                        <div className="drag-target">
                          <div className="component-image"></div>
                          <div className="component-name">
                            {childItem.label}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </ReactSortable>
            </div>
          )
        })}
      </>
    )
  }

  const renderBody = () => {
    if (mode === 'draw') {
      return (
        <div className="p-10">
          <Empty description="自由绘制模式，敬请期待..." />
        </div>
      )
    }
    return renderFormPool()
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
              checkedChildren="页面组装模式"
              unCheckedChildren="自由绘制模式"
              checked={mode === 'assemble'}
              onChange={(val) => {
                setGlobal({
                  type: UPDATE_MODE,
                  payload: {
                    mode: val ? 'assemble' : 'draw',
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
