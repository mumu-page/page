import React from 'react'
import {
  WindowsOutlined,
  FormOutlined,
  LineChartOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { Logo } from '../components'
import SwtichMode from './components/SwtichMode'
import { IActionType, useStore } from '@r-generator/stores'
import { handleBtnType, handleColor, isDisabled } from './utils'

interface ILeftActionProp {
  handleType: (val: IActionType) => void
  type: IActionType
}
export default (props: ILeftActionProp) => {
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
        <Button
          type={handleBtnType('history', type)}
          icon={<HistoryOutlined style={handleColor('history', type)} />}
          onClick={() => handleType('history')}
        />
      </div>
      <Logo />
    </div>
  )
}
