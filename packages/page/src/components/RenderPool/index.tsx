import React, { forwardRef, useState } from 'react'
import { PoolGroup, PoolItem } from '../../constants'
import { shortid } from '@r-generator/shared'
import { useStore } from '@r-generator/stores'
import { Empty, Input, RowProps, Typography } from 'antd'
import { ReactSortable } from 'react-sortablejs'
import { cloneDeep } from 'lodash'
import { addComponent } from './utils'
import './index.less'

const RowWrap = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  return <div {...props} ref={ref} className="component-list" />
})

interface IRenderPool {
  title: string
  pools: PoolGroup<PoolItem>[]
}

export default function RenderPool(props: IRenderPool) {
  const { pools, title } = props
  const [list, setList] = useState(pools)
  const { setGlobal, mode } = useStore()

  const onSearch = (value: string) => {
    const sourceData = cloneDeep(pools)
    const filterResult = sourceData.map((item) => {
      if (Array.isArray(item.children)) {
        item.children = item.children.filter(
          (item) => item.title.indexOf(value) !== -1
        )
      }
      return item
    })
    setList(filterResult)
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

  const renderChildren = (item: PoolGroup<PoolItem>) => {
    if (!(Array.isArray(item.children) && item.children.length)) {
      return (
        <div>
          <Empty description="数据为空" />
        </div>
      )
    }
    return (
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
      >
        {item.children.map((childItem) => {
          childItem.id = shortid()
          return (
            <div
              key={childItem.id}
              className="component-item"
              onClick={() => addComponent(childItem, setGlobal)}
            >
              <div className="drag-target">
                <div className="component-image"></div>
                <div className="component-name">{childItem.title}</div>
              </div>
            </div>
          )
        })}
      </ReactSortable>
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
          <div key={shortid()}>
            <Typography.Title level={5} style={{ marginTop: '0.5em' }}>
              <Typography.Text type="secondary">{item.title}</Typography.Text>
            </Typography.Title>
            {renderChildren(item)}
          </div>
        )
      })}
    </div>
  )
}
