import React, { forwardRef, useCallback, useRef } from 'react'
import { Col, Form, Row, RowProps } from 'antd'
import { useEffect } from 'react'
import ComponentItem from './FormItem'
import { ContextMenu } from '../../components'
import { shortid } from '../../utils/utils'
import {
  CopyOutlined,
  SettingOutlined,
  DeleteOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import {
  Store,
  ISetGlobal,
  IFormComProp,
  IMoveableOptions,
} from '@r-generate/core'
import { isDatePicker } from '../../utils/utils'
import { Target_ClassName } from '../../constants'
import Menu from '../../components/ContextMenu/Menu'
import {
  INFINITEVIEWER_SCROLL,
  SHOW_SETTING_PANL,
} from '../../constants/events'
import eventBus from '../../utils/eventBus'
import './index.less'
import { ReactSortable } from 'react-sortablejs'

const { Utils, actionTypes, Hooks } = Store
const {
  COPY_COMPONENT_LIST,
  DELETE_TARGET,
  DEL_COMPONENT_LIST,
  LEFT_REMOVE_COMPONENTS,
  RIGHT_REMOVE_COMPONENTS,
  SET_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
  SET_TARGET_BY_COMPONENT_LIST,
} = actionTypes
const { useStore } = Hooks

interface EditorAreaProps extends ISetGlobal<object> {
  componentList: IFormComProp[]
  target: IFormComProp
  moveableOptions: IMoveableOptions
}

enum HANDLE_TYPE {
  copy = '复制',
  setting = '设置属性',
  del = '删除',
  toLeft = '左移',
  toRight = '右移',
}

const { refreshTarget } = Utils

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
  const { rowProps = {} } = target || {}
  const { colNum, ...otherRow } = rowProps
  return <Row {...props} {...otherRow} ref={ref} />
})

const ghostClass = 'sortable-ghost'
const chosenClass = 'sortable-chosen'

export default function Container(props: EditorAreaProps) {
  const {
    target,
    moveableOptions,
    componentList = [],
    setGlobal: commonDispatch,
  } = props
  const [form] = Form.useForm()
  const contenxtMenu = useRef(null)
  const {
    componentProps,
    formItemProps,
    formProps = {},
    colProps = {},
    rowProps = {},
  } = target || {}

  const { colNum, ...otherRow } = rowProps

  const setComponentlist = (
    id: string | number | undefined,
    componentList: IFormComProp[]
  ) => {
    commonDispatch({
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
      commonDispatch({
        type: DEL_COMPONENT_LIST,
        payload: {
          id: target.id,
        },
      })
      commonDispatch({
        type: DELETE_TARGET,
      })
      commonDispatch({
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
      commonDispatch({
        type: COPY_COMPONENT_LIST,
        payload: {
          id: target.id,
          newId,
        },
      })
    }
    if (label === HANDLE_TYPE.toLeft) {
      commonDispatch({
        type: LEFT_REMOVE_COMPONENTS,
        payload: {
          id: target.id,
        },
      })
      refreshTarget(moveableOptions?.target, commonDispatch)
    }
    if (label === HANDLE_TYPE.toRight) {
      commonDispatch({
        type: RIGHT_REMOVE_COMPONENTS,
        payload: {
          id: target.id,
        },
      })
      refreshTarget(moveableOptions?.target, commonDispatch)
    }
  }

  const onScroll = useCallback(() => {
    ;(contenxtMenu.current as any)?.hide?.()
  }, [])

  useEffect(() => {
    // setMoveableOption(target.id)
    eventBus.addListener(INFINITEVIEWER_SCROLL, onScroll)
    return () => {
      eventBus.removeListener(INFINITEVIEWER_SCROLL, onScroll)
    }
  }, [])

  useEffect(() => {
    if (formItemProps?.name) {
      form.setFieldsValue({
        [formItemProps.name]: componentProps?.defaultValue,
      })
    }
  }, [target.id])

  useEffect(() => {
    const _initialValues = {} as any
    componentList.forEach((item) => {
      const { componentKey, formItemProps, componentProps } = item
      const { name } = formItemProps || {}
      const { defaultValue } = componentProps || {}
      if (!isDatePicker(componentKey)) {
        _initialValues[name] = defaultValue
      }
    })
    form.setFieldsValue(_initialValues)
  }, [componentList, form])

  return (
    <Form
      {...formProps}
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
          name: 'form-wrap',
          put: true,
        }}
        setList={(newState) => {
          commonDispatch({
            type: SET_COMPONENT_LIST,
            payload: { newState, id: target?.id },
          })
        }}
        onChoose={(e) => {
          const id = e.item.dataset.id
          //   e.item.target.classList
          if (id === target.id) return
          commonDispatch({
            type: SET_TARGET_BY_COMPONENT_LIST,
            payload: { id },
          })
          setComponentlist(id, componentList)
        }}
        onUnchoose={(e) => {
          e.item.classList.add('sortable-chosen')
        }}
      >
        {componentList.map((item: IFormComProp) => {
          const {
            id,
            chosen,
            children,
            componentKey,
            formItemProps,
            componentProps,
            colProps: selfColProps = {},
            layout = {},
          } = item

          const { frame = { translate: [0, 0, 0] }, height, width } = layout
          const { translate } = frame
          const style = {
            display: 'inline-block',
            transform: `translate(${translate[0]}px, ${translate[1]}px)`,
          } as any

          if (typeof width === 'number') {
            style.width = `${width}px`
          } else if (typeof width === 'string') {
            style.width = width
          }
          if (height) {
            style.height = `${height}px`
          }

          const { align, gutter, justify, wrap, ...otherRowG } = otherRow
          const { colNum: colNum2, ...otherCol } = selfColProps

          return (
            <Col
              key={id}
              //   style={style}
              {...{
                ...otherRowG,
                ...otherCol,
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                commonDispatch({
                  type: SET_TARGET_BY_COMPONENT_LIST,
                  payload: { id },
                })
                // 无论dom元素如何变，componentList没有变
                setComponentlist(id, componentList)
                ;(contenxtMenu.current as any)?.show?.(e)
              }}
            >
              <div
                data-id={id}
                className={`${Target_ClassName} ${
                  chosen ? Target_ClassName + '-chosen' : ''
                }`}
                // style={{
                //   paddingBottom: 24,
                // }}
                onClick={(e: any) => {
                  e.stopPropagation()
                  //  console.log('onClick', e)
                  if (id === target.id) return
                  commonDispatch({
                    type: SET_TARGET_BY_COMPONENT_LIST,
                    payload: { id },
                  })
                  setComponentlist(id, componentList)
                }}
              >
                <ComponentItem
                  id={id}
                  key={id}
                  form={form}
                  children={children}
                  colProps={colProps}
                  rowProps={rowProps}
                  formProps={formProps}
                  formItemProps={formItemProps}
                  componentProps={componentProps}
                  componentKey={componentKey}
                  //   style={{
                  //     marginBottom: 0,
                  //   }}
                />
              </div>
            </Col>
          )
        })}
      </ReactSortable>
      <ContextMenu ref={contenxtMenu}>
        <Menu options={actions} onClick={handleContextMenuClick} />
      </ContextMenu>
    </Form>
  )
}
