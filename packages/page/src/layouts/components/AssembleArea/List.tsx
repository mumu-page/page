import React, { forwardRef, useCallback, useRef } from 'react'
import { Col, Form, Row, RowProps } from 'antd'
import { useEffect } from 'react'
import ComponentItem from './Item'
import { ContextMenu } from '../../../components'
import { shortid } from '../../../utils/utils'
import {
  CopyOutlined,
  SettingOutlined,
  DeleteOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import {
  COPY_COMPONENT_LIST,
  DELETE_TARGET,
  DEL_COMPONENT_LIST,
  LEFT_REMOVE_COMPONENTS,
  RIGHT_REMOVE_COMPONENTS,
  SET_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
  SET_TARGET_BY_COMPONENT_LIST,
  refreshTarget,
  useStore,
} from '@r-generator/stores'
import { Target_ClassName } from '../../../constants'
import Menu from '../../../components/ContextMenu/Menu'
import {
  INFINITEVIEWER_SCROLL,
  SHOW_SETTING_PANL,
} from '../../../constants/events'
import eventBus from '../../../utils/eventBus'
import { ReactSortable } from 'react-sortablejs'
import { PoolItem } from '@r-generator/stores'
import { IContextMenuRef } from '../../../components/ContextMenu'
import './index.less'

enum HANDLE_TYPE {
  copy = '复制',
  setting = '设置属性',
  del = '删除',
  toLeft = '左移',
  toRight = '右移',
}

const actions = [
  {
    key: 'toTop',
    icon: <VerticalAlignTopOutlined />,
    label: HANDLE_TYPE.toLeft,
    type: 'toTop',
  },
  {
    key: 'topBottom',
    icon: <VerticalAlignBottomOutlined />,
    label: HANDLE_TYPE.toRight,
    type: 'topBottom',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: HANDLE_TYPE.copy,
  },
  {
    key: 'del',
    icon: <DeleteOutlined />,
    label: HANDLE_TYPE.del,
    type: 'del',
  },
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: HANDLE_TYPE.setting,
  },
]

const Wrap = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const { target } = useStore()
  const { layout = {} } = target || {}
  return <Row {...props} {...layout.row} ref={ref} />
})

const ghostClass = 'sortable-ghost'
const chosenClass = 'sortable-chosen'

export default function List() {
  const {
    target,
    moveableOptions,
    componentList,
    setGlobal,
    layoutType,
    commonProps,
  } = useStore()
  const [form] = Form.useForm()
  const contenxtMenu = useRef<IContextMenuRef>(null)
  const { layout = {} } = commonProps || {}

  const setComponentlist = (
    id: string | number | undefined,
    componentList: PoolItem[]
  ) => {
    setGlobal({
      type: SET_COMPONENT_LIST,
      payload: {
        newState: componentList,
        id,
      },
    })
  }

  /**
   * 处理右键菜单点击事件
   * @param key
   * @param label
   */
  const handleContextMenuClick = (key: string, label: string) => {
    if (label === HANDLE_TYPE.del) {
      setGlobal({
        type: DEL_COMPONENT_LIST,
        payload: {
          id: target.id,
        },
      })
      setGlobal({
        type: DELETE_TARGET,
      })
      setGlobal({
        type: SET_MOVEABLE_OPTIONS,
        payload: {
          target: null,
        },
      })
    }
    if (label === HANDLE_TYPE.setting) {
      eventBus.emit(SHOW_SETTING_PANL)
    }
    if (label === HANDLE_TYPE.copy) {
      const newId = shortid()
      setGlobal({
        type: COPY_COMPONENT_LIST,
        payload: {
          id: target.id,
          newId,
        },
      })
    }
    if (label === HANDLE_TYPE.toLeft) {
      setGlobal({
        type: LEFT_REMOVE_COMPONENTS,
        payload: {
          id: target.id,
        },
      })
      refreshTarget(moveableOptions?.target, setGlobal)
    }
    if (label === HANDLE_TYPE.toRight) {
      setGlobal({
        type: RIGHT_REMOVE_COMPONENTS,
        payload: {
          id: target.id,
        },
      })
      refreshTarget(moveableOptions?.target, setGlobal)
    }
  }

  const onScroll = useCallback(() => {
    contenxtMenu.current?.hide?.()
  }, [])

  useEffect(() => {
    // setMoveableOption(target.id)
    eventBus.addListener(INFINITEVIEWER_SCROLL, onScroll)
    return () => {
      eventBus.removeListener(INFINITEVIEWER_SCROLL, onScroll)
    }
  }, [])

  useEffect(() => {
    if (commonProps?.form?.formItem?.name) {
      form.setFieldsValue({
        [commonProps?.form?.formItem?.name]:
          commonProps?.form?.formItem?.defaultValue,
      })
    }
  }, [commonProps])

  // useEffect(() => {
  // const _initialValues = {} as any
  // componentList.forEach((item) => {
  //   const { componentKey, formItemProps, componentProps } = item
  //   const { name } = formItemProps || {}
  //   const { defaultValue } = componentProps || {}
  //   if (!isDatePicker(componentKey)) {
  //     _initialValues[name] = defaultValue
  //   }
  // })
  // form.setFieldsValue(_initialValues)
  // }, [componentList, form])

  const renderItem = (item: PoolItem) => {
    const { id, chosen, props } = item

    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      setGlobal({
        type: SET_TARGET_BY_COMPONENT_LIST,
        payload: { id },
      })
      // 无论dom元素如何变，componentList没有变
      setComponentlist(id, componentList)
      contenxtMenu.current?.show?.(e)
    }

    const content = (
      <div
        key={id}
        data-id={id}
        className={`${Target_ClassName} ${
          chosen ? Target_ClassName + '-chosen' : ''
        }`}
        onContextMenu={layoutType === 'mobility' ? onContextMenu : () => {}}
        onClick={(e: any) => {
          e.stopPropagation()
          contenxtMenu.current?.hide?.()
          //  console.log('onClick', e)
          if (id === target.id) return
          setGlobal({
            type: SET_TARGET_BY_COMPONENT_LIST,
            payload: { id },
          })
          setComponentlist(id, componentList)
        }}
      >
        <ComponentItem
          children={item.children}
          componentProps={item.props}
          type={item.type}
        />
      </div>
    )
    if (layoutType === 'flexible') {
      return (
        <Col key={id} onContextMenu={onContextMenu} {...(layout.col || {})}>
          {content}
        </Col>
      )
    }
    return content
  }

  const renderItems = (componentList: PoolItem[]) => {
    return componentList.map((item: PoolItem) => {
      return renderItem(item)
    })
  }

  return (
    <Form
      style={{
        height: '100%',
        position: 'relative',
      }}
      form={form}
    >
      <ReactSortable
        sort
        animation={150}
        // delay={200}
        tag={Wrap}
        list={componentList}
        ghostClass={ghostClass}
        chosenClass={chosenClass}
        group={{
          name: 'AssembleArea',
          put: true,
        }}
        setList={(newState) => {
          setGlobal({
            type: SET_COMPONENT_LIST,
            payload: { newState, id: target?.id },
          })
        }}
        onChoose={(e) => {
          const id = e.item.dataset.id
          //   e.item.target.classList
          if (id === target.id) return
          setGlobal({
            type: SET_TARGET_BY_COMPONENT_LIST,
            payload: { id },
          })
          setComponentlist(id, componentList)
        }}
        onUnchoose={(e) => {
          e.item.classList.add('sortable-chosen')
        }}
      >
        {renderItems(componentList)}
      </ReactSortable>
      <ContextMenu ref={contenxtMenu}>
        <Menu options={actions} onClick={handleContextMenuClick} />
      </ContextMenu>
    </Form>
  )
}
