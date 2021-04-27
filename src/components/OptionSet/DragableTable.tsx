import React, { useEffect, useState } from 'react'
import { Button, Divider, Space, Tree, Typography } from 'antd'
import { cloneDeep } from 'lodash'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import EditableCell from './EditableCell'
import { shortid } from '../../utils/utils'
import './index.less'

export interface Option {
  value: string | number
  key: string | number
  label?: React.ReactNode
  title?: React.ReactNode
  disabled?: boolean
  children?: Option[]
  [key: string]: any
}

export function find(
  key: string | number,
  data: Option[] = [],
  onSuccess?: (
    item: Option,
    i: number,
    target: Option[],
    data: Option[]
  ) => void,
  onFail?: () => void // 没有找到
) {
  let flag = false
  function next(_key: string | number, _target: Option[] = []) {
    for (let i = 0; i < _target.length; i++) {
      const item = _target[i]
      if (item.key === _key) {
        flag = true
        onSuccess?.(item, i, _target, data)
        return _target
      }
      if (Array.isArray(item.children)) {
        next(_key, item.children)
      }
    }
    return _target
  }
  const result = next(key, data)
  if (!flag) {
    onFail?.()
  }
  return result
}

function asyncFind(
  key: string | number,
  target: Option[] = []
): Promise<{ item: Option; i: number; target: Option[]; data: Option[] }> {
  return new Promise((resolve, reject) => {
    find(
      key,
      target,
      (item, i, target, data) => resolve({ item, i, target, data }),
      reject
    )
  })
}

export interface IDragableTable {
  dataSource: Option[] | undefined
  onChange?: (
    values: Option[],
    updateValue: React.Dispatch<React.SetStateAction<Option[]>>
  ) => void
}

export default (props: IDragableTable) => {
  const { dataSource = [], onChange } = props
  const [treeData, setTreeData] = useState<Option[]>([])
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

  const onDragEnter = (info: any) => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  }

  const onDrop = (info: any) => {
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data: string | any[], key: any, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children, key, callback)
        }
      }
    }
    const data = cloneDeep(treeData)

    // Find dragObject
    let dragObj: any
    loop(data, dragKey, (item: any, index: any, arr: any[]) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: { children: any[] }) => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: { children: any[] }) => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar: any[] = []
      let i = 0
      loop(data, dropKey, (item: any, index: any, arr: any) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }

    setTreeData(data)
  }

  const add = (newItem: Option) => {
    if (!selectedKeys?.length) {
      const _data = cloneDeep(treeData)
      _data?.push(newItem)
      setTreeData(_data)
    } else {
      asyncFind(selectedKeys[0], cloneDeep(treeData))
        .then(({ item, i, target, data }) => {
          ;(item.children || (item.children = [])).push(newItem)
          setTreeData(cloneDeep(data))
        })
        .catch((e) => {
          const _data = cloneDeep(treeData)
          _data?.push(newItem)
          setTreeData(cloneDeep(_data))
        })
    }
  }

  const del = (key: string | number) => {
    const newTreeData = find(key, cloneDeep(treeData), (item, i, target) => {
      target.splice(i, 1)
    })
    setTreeData(newTreeData)
  }

  const update = (key: string | number, value: any, field: string) => {
    const newTreeData = find(key, cloneDeep(treeData), (item) => {
      item[field] = value
    })
    setTreeData(newTreeData)
  }

  const renderHeader = () => {
    return (
      <div className="tree-header">
        <span className="tree-header-item">
          <span>选项内容</span>
          <span>label</span>
        </span>
        <span className="tree-header-item">
          <span>选项值</span>
          <span>value</span>
        </span>
        <span className="tree-header-item">操作</span>
      </div>
    )
  }

  const renderTreeNodes = (treeData: Option[]) => {
    return treeData.map((item) => {
      return (
        <Tree.TreeNode
          className="draggable-tree-node"
          key={item.key}
          title={
            <>
              <span className="draggable-tree-node-item">
                <EditableCell
                  className="draggable-tree-node-item-editable"
                  onChange={(val: any) => {
                    update(item.key, val, 'label')
                  }}
                >
                  {item.label}
                </EditableCell>
              </span>
              <span className="draggable-tree-node-item">
                <EditableCell
                  className="draggable-tree-node-item-editable"
                  onChange={(val: any) => {
                    update(item.key, val, 'value')
                  }}
                >
                  {item.value}
                </EditableCell>
              </span>
              <span className="draggable-tree-node-item draggable-tree-node-item-action">
                <Button
                  type="link"
                  className="btn"
                  onClick={() => {
                    del(item.key)
                  }}
                >
                  删除
                </Button>
              </span>
            </>
          }
          switcherIcon={(props) => {
            const { expanded } = props
            if (!item.children?.length) {
              return null
            }
            return expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />
          }}
        >
          {Array.isArray(item.children) && renderTreeNodes(item.children)}
        </Tree.TreeNode>
      )
    })
  }

  useEffect(() => {
    setTreeData(dataSource)
  }, [])

  useEffect(() => {
    onChange?.(cloneDeep(treeData), setTreeData)
  }, [treeData])

  return (
    <>
      {renderHeader()}
      <Tree
        className="draggable-tree"
        selectedKeys={selectedKeys}
        // autoExpandParent
        draggable
        blockNode
        height={233}
        // selectable={false}
        showIcon
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onSelect={(selectedKeys) => {
          setSelectedKeys(selectedKeys)
        }}
      >
        {renderTreeNodes(treeData)}
      </Tree>
      <Space
        style={{
          marginTop: 10,
        }}
        split={<Divider type="vertical" />}
      >
        <Typography.Link
          onClick={() => {
            const newId = shortid()
            add({
              label: '新的选项',
              value: newId,
              key: newId,
            })
          }}
        >
          添加一项
        </Typography.Link>
        {/* <Typography.Link onClick={() => {}}>添加分组</Typography.Link> */}
      </Space>
    </>
  )
}
