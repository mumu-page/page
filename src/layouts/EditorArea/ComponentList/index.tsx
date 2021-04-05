import React, { useCallback, useRef } from 'react'
import { Col, Form, Row } from 'antd'
import { useEffect } from 'react'
import ComponentItem from '../ComponentItem'
import { ContextMenu } from '../../../components'
import shortid from 'shortid'
import {
  CopyOutlined,
  SettingOutlined,
  DeleteOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import { ICommonDispatch, IFormComProp } from '../../../stores/typings'
import { findTarget, isDatePicker } from '../../../utils/utils'
import { Target_ClassName } from '../../../constants'
import {
  COPY_COMPONENT_LIST,
  DELETE_TARGET,
  DEL_COMPONENT_LIST,
  SET_MOVEABLE_OPTIONS,
  SET_TARGET_BY_COMPONENT_LIST,
} from '../../../stores/action-type'
import Menu from '../../../components/ContextMenu/Menu'
import {
  INFINITEVIEWER_SCROLL,
  SHOW_SETTING_PANL,
} from '../../../constants/events'
import eventBus from '../../../utils/eventBus'
import './index.less'

interface EditorAreaProps extends ICommonDispatch<object> {
  componentList: IFormComProp[]
  target: IFormComProp
}

enum HANDLE_TYPE {
  copy = '复制这个',
  setting = '设置属性',
  del = '删除这个',
  toTop = '上移',
  topBottom = '下移',
}

const options = [
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: HANDLE_TYPE.copy,
  },
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: HANDLE_TYPE.setting,
  },
  {
    key: 'del',
    icon: <DeleteOutlined />,
    label: HANDLE_TYPE.del,
    type: 'del',
  },
  {
    key: 'toTop',
    icon: <VerticalAlignTopOutlined />,
    label: HANDLE_TYPE.toTop,
    type: 'toTop',
  },
  {
    key: 'topBottom',
    icon: <VerticalAlignBottomOutlined />,
    label: HANDLE_TYPE.topBottom,
    type: 'topBottom',
  },
]

export default function Container(props: EditorAreaProps) {
  const { target, componentList = [], commonDispatch } = props
  const [form] = Form.useForm()
  const contenxtMenu = useRef(null)
  const {
    componentProps,
    formItemProps,
    formProps = {},
    colProps = {},
    rowProps = {},
  } = target

  const setMoveableOption = (id: string | number) => {
    const { elementGuidelines, target, frame } = findTarget(id, componentList)
    commonDispatch({
      type: SET_MOVEABLE_OPTIONS,
      payload: {
        frame,
        elementGuidelines,
        target,
        /**
         * 禁用调整大小和拖动
         * 原因：Row Col 和 ReactiveMoveable 有冲突
         */
        draggable: false,
        resizable: false,
      },
    })
  }

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
      requestAnimationFrame(() => {
        setMoveableOption(newId)
      })
    }
  }

  const onScroll = useCallback(() => {
    ;(contenxtMenu.current as any)?.hide?.()
  }, [])

  useEffect(() => {
    setMoveableOption(target.id)
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
      <Row {...rowProps}>
        {componentList.map((item: IFormComProp, index: number) => {
          const {
            id,
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

          return (
            <Col
              key={id}
              //   style={style}
              {...{
                ...rowProps,
                ...selfColProps,
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                commonDispatch({
                  type: SET_TARGET_BY_COMPONENT_LIST,
                  payload: { id },
                })
                // 无论dom元素如何变，componentList没有变
                setMoveableOption(id)
                ;(contenxtMenu.current as any)?.show?.(e)
              }}
            >
              <div
                data-id={id}
                className={Target_ClassName}
                onClick={(e) => {
                  e.stopPropagation()
                  commonDispatch({
                    type: SET_TARGET_BY_COMPONENT_LIST,
                    payload: { id },
                  })
                  // 无论dom元素如何变，componentList没有变
                  setMoveableOption(id)
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
                />
              </div>
            </Col>
          )
        })}
      </Row>
      <ContextMenu ref={contenxtMenu}>
        <Menu options={options} onClick={handleContextMenuClick} />
      </ContextMenu>
    </Form>
  )
}
