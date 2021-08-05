import React from 'react'
import { WindowsOutlined, FormOutlined, LineChartOutlined } from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { BtnTypes } from '.'
import { Logo } from '../components'
import { IconFont } from '../constants'
import SwtichMode from './components/SwtichMode'
import { useStore } from '@r-generator/stores'

interface RightActionType {
  handleType: (val: BtnTypes) => void
  type: BtnTypes
}
export default (props: RightActionType) => {
  const { type, handleType } = props
  const { mode } = useStore()

  const handleColor = (val: BtnTypes) => {
    return {
      color: type !== val ? '#fff' : '',
      fontSize: 18,
    }
  }

  const handleBtnType = (val: BtnTypes) => {
    return type === val ? 'primary' : 'text'
  }

  const isghost = (val: BtnTypes) => {
    return type !== val
  }

  const disabled = mode === 'draw'

  return (
    <div className="left-action">
      <div className="action">
        <Button
          disabled={disabled}
          type={handleBtnType('base-pool')}
          ghost={isghost('base-pool')}
          icon={<WindowsOutlined style={handleColor('base-pool')} />}
          onClick={() => handleType('base-pool')}
        />
        <Button
          disabled={disabled}
          type={handleBtnType('form-pool')}
          ghost={isghost('form-pool')}
          icon={<FormOutlined style={handleColor('form-pool')} />}
          onClick={() => handleType('form-pool')}
        />
        <Button
          disabled={disabled}
          type={handleBtnType('chart-pool')}
          ghost={isghost('chart-pool')}
          icon={<LineChartOutlined style={handleColor('chart-pool')} />}
          onClick={() => handleType('chart-pool')}
        />
        <SwtichMode
          type={type}
          handleBtnType={handleBtnType}
          handleColor={handleColor}
          isghost={isghost}
          handleType={handleType}
        />
      </div>
      <Logo />
    </div>
  )
}
