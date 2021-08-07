import React, { useCallback, useEffect, useRef } from 'react'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PicCenterOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { Playground, PreviewInstanceProps } from '../components'
import { SCROLL_CENTER, SHOW_SETTING_PANL } from '../constants/events'
import {
  DELETE_ALL_COMPONENT_LIST_AND_TARGET,
  IActionType,
  SET_MOVEABLE_OPTIONS,
  useStore,
} from '@r-generator/stores'
import { parseJSON } from '../utils/parseJSON'
import eventBus from '../utils/eventBus'
import { handleBtnType, handleColor } from './utils'

interface RightActionType {
  handleType: (val: IActionType) => void
  type: IActionType
}
export default (props: RightActionType) => {
  const { type, handleType } = props
  const preview = useRef<PreviewInstanceProps>(null)
  const {
    target: currentDragComponent,
    componentList,
    setGlobal: commonDispatch,
  } = useStore()

  const clean = () => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要清空所有组件吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        commonDispatch({ type: DELETE_ALL_COMPONENT_LIST_AND_TARGET })
        commonDispatch({
          type: SET_MOVEABLE_OPTIONS,
          payload: {
            target: null,
          },
        })
      },
    })
  }

  const run = () => {
    preview.current?.run()
    preview.current?.open()
  }

  const download = () => {}

  const center = () => {
    eventBus.emit(SCROLL_CENTER)
  }

  const handlePreview = () => {
    const data = parseJSON(componentList, currentDragComponent)
    console.log(data)
  }

  const handelShowSettingPanl = useCallback(() => {
    handleType('setting')
  }, [])

  useEffect(() => {
    eventBus.addListener(SHOW_SETTING_PANL, handelShowSettingPanl)
    return () => {
      eventBus.removeListener(SHOW_SETTING_PANL, handelShowSettingPanl)
    }
  }, [])

  return (
    <div className="right-action">
      <Button
        icon={<PlayCircleOutlined style={handleColor('run', type)} />}
        type={handleBtnType('run', type)}
        onClick={() => {
          run()
        }}
      />
      <Button
        icon={<PicCenterOutlined style={handleColor('center', type)} />}
        type={handleBtnType('center', type)}
        onClick={() => {
          center()
        }}
      />
      <Button
        icon={<EyeOutlined style={handleColor('preview', type)} />}
        type={handleBtnType('preview', type)}
        size="middle"
        onClick={() => {
          handlePreview()
        }}
      />
      <Button
        icon={
          <VerticalAlignBottomOutlined style={handleColor('download', type)} />
        }
        type={handleBtnType('download', type)}
        size="middle"
        onClick={() => {
          download()
        }}
      />
      <Button
        icon={<DeleteOutlined style={handleColor('clean', type)} />}
        type={handleBtnType('clean', type)}
        danger
        onClick={() => {
          clean()
        }}
      />
      <Button
        icon={<SettingOutlined style={handleColor('setting', type)} />}
        type={handleBtnType('setting', type)}
        onClick={() => handleType('setting')}
      />
      <Playground ref={preview} />
    </div>
  )
}
