import React from 'react'
import { WindowsOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { BtnTypes } from '.'
import { Logo } from '../../components'

interface RightActionType {
  handleType: (val: BtnTypes) => void
  type: BtnTypes
}
export default (props: RightActionType) => {
  const { type, handleType } = props

  const handleColor = (val: BtnTypes) => {
    return {
      color: type !== val ? '#fff' : '',
      fontSize: 18,
    }
  }

  return (
    <div className="left-action">
      <Button
        type={type === 'coms' ? 'primary' : 'text'}
        ghost={type !== 'coms'}
        icon={<WindowsOutlined style={handleColor('coms')} />}
        onClick={() => handleType('coms')}
      />
      <Logo></Logo>
    </div>
  )
}
