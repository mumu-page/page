import React from 'react'
import {
  WindowsOutlined,
  FormOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { BtnTypes } from '.'
import { Logo } from '../components'
import SwtichMode from './components/SwtichMode'
import { useStore } from '@r-generator/stores'
import { handleBtnType, handleColor, isDisabled } from './utils'

interface RightActionType {
  handleType: (val: BtnTypes) => void
  type: BtnTypes
}
export default (props: RightActionType) => {
  const { type, handleType } = props
  const { mode } = useStore()

  return (
    <div className="left-action">
      <div className="action">
        <Button
          disabled={isDisabled(mode)}
          type={handleBtnType('base-pool', type)}
          icon={<WindowsOutlined style={handleColor('base-pool', type)} />}
          onClick={() => handleType('base-pool')}
        />
        <Button
          disabled={isDisabled(mode)}
          type={handleBtnType('form-pool', type)}
          icon={<FormOutlined style={handleColor('form-pool', type)} />}
          onClick={() => handleType('form-pool')}
        />
        <Button
          disabled={isDisabled(mode)}
          type={handleBtnType('chart-pool', type)}
          icon={<LineChartOutlined style={handleColor('chart-pool', type)} />}
          onClick={() => handleType('chart-pool')}
        />
        <SwtichMode
          type={type}
          handleBtnType={handleBtnType}
          handleColor={handleColor}
          handleType={handleType}
        />
      </div>
      <Logo />
    </div>
  )
}
