import React, { forwardRef } from 'react'
import { FormOption, OptionItem } from '../../constants'
import { shortid } from '@r-generator/shared'
import { useStore, IFormComProp, PUT_COMPONENT_LIST } from '@r-generator/stores'
import { Empty, Input, RowProps, Typography } from 'antd'
import { ReactSortable } from 'react-sortablejs'
import { cloneDeep } from 'lodash'
import './index.less'

const RowWrap = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  return <div {...props} ref={ref} className="component-list" />
})

interface IRenderPool {
  title: string
  list: {
    children: (IFormComProp & OptionItem)[] | undefined
    label: string
    key: string
    value: string
  }[]
  setList: React.Dispatch<React.SetStateAction<any>>
}

const resetId = (list: FormOption[]) => {
  return list.map((item) => {
    if (Array.isArray(item.children)) {
      item.children.forEach((item2) => {
        const id = shortid()
        item2.id = id
      })
    }
    return item
  })
}

export default function RenderPool(props: IRenderPool) {
  const { list, setList, title } = props
  const { setGlobal, mode } = useStore()

  const onSearch = (_value: string) => {
    // console.log(value)
  }

  if (mode === 'draw') {
    return (
      <div className="render-pool isdraw">
        <Empty description="当前为自由绘制模式，请切换为页面组装模式..." />
      </div>
    )
  }

  if (!list.length) {
    return (
      <div className="render-pool empty">
        <Empty description="数据为空" />
      </div>
    )
  }

  return (
    <div className="render-pool">
      <Input.Search
        placeholder="请输入组件名称"
        enterButton="搜索"
        // size="large"
        onSearch={onSearch}
      />
      <Typography.Title level={4} style={{ marginTop: '0.5em' }}>
        <Typography.Text type="secondary">{title}</Typography.Text>
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
                setList(resetId(list))
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
                        <div className="component-name">{childItem.label}</div>
                      </div>
                    </div>
                  )
                })}
            </ReactSortable>
          </div>
        )
      })}
    </div>
  )
}
