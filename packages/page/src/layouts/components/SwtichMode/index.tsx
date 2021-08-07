import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Popover, Row, Switch } from 'antd'
import { IActionType, UPDATE_MODE, useStore } from '@r-generator/stores'
import { CloseOutlined, SwapOutlined } from '@ant-design/icons'

interface ISwtichMode {
  handleBtnType: (val: IActionType, type: IActionType) => 'primary' | 'text'
  handleColor: (
    arg: IActionType,
    type: IActionType
  ) => {
    color: string
    fontSize: number
  }
  type: IActionType
  handleType: (arg: IActionType) => void
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
      title={
        <Row justify="space-between">
          <Col>模式切换</Col>
          <Col>
            <CloseOutlined
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setVisible(false)
              }}
            />
          </Col>
        </Row>
      }
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
