import React, { useEffect, useState } from 'react'
import { Button, Form, Popover, Switch } from 'antd'
import { BtnTypes } from '../..'
import { UPDATE_MODE, useStore } from '@r-generator/stores'
import { SwapOutlined } from '@ant-design/icons'

interface ISwtichMode {
  handleBtnType: (val: BtnTypes, type: BtnTypes) => 'primary' | 'text'
  handleColor: (
    arg: BtnTypes,
    type: BtnTypes
  ) => {
    color: string
    fontSize: number
  }
  type: BtnTypes
  handleType: (arg: BtnTypes) => void
}

export default function SwtichMode(props: ISwtichMode) {
  const { handleBtnType, handleColor, handleType, type } = props
  const { setGlobal, mode } = useStore()
  const [visible, setVisible] = useState(false)

  const handleVisibleChange = (_visible: boolean) => {
    setVisible(true)
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

  useEffect(() => {
    if (type !== 'swtich') {
      setVisible(false)
    }
  }, [type])

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
        type={handleBtnType('swtich', type)}
        icon={<SwapOutlined style={handleColor('swtich', type)} />}
        onClick={() => {
          handleType('swtich')
        }}
      />
    </Popover>
  )
}
