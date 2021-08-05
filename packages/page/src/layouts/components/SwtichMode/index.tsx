import React, { useState } from 'react'
import { Button, Form, Popover, Switch } from 'antd'
import { BtnTypes } from '../..'
import { IconFont } from '../../../constants'
import { UPDATE_MODE, useStore } from '@r-generator/stores'
import { SwapOutlined } from '@ant-design/icons'

interface ISwtichMode {
  handleBtnType: (val: BtnTypes) => 'primary' | 'text'
  isghost: (arg: BtnTypes) => boolean
  handleColor: (arg: BtnTypes) => {
    color: string
    fontSize: number
  }
  type: BtnTypes
  handleType: (arg: BtnTypes) => void
}

export default function SwtichMode(props: ISwtichMode) {
  const { handleBtnType, isghost, handleColor, handleType, type } = props
  const { setGlobal, mode } = useStore()
  const [visible, setVisible] = useState(false)

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
  }

  const renderContent = () => {
    return (
      <Form.Item style={{ marginBottom: 0 }} label="模式">
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
    )
  }

  return (
    <Popover
      placement="rightTop"
      content={renderContent()}
      title="模式切换"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button
        type={handleBtnType('swtich')}
        ghost={isghost('swtich')}
        icon={<SwapOutlined style={handleColor('swtich')} />}
      />
    </Popover>
  )
}
