import React, { useState } from 'react'
import LeftSidebar from '../left-sidebar'
import RightSidebar from '../right-sidebar'
import LeftAction from './LeftAction'
import RightAction from './RightAction'
import './index.less'
import { Logo } from '../../components'

export type BtnTypes =
  | 'coms'
  | ''
  | 'run'
  | 'clean'
  | 'copy'
  | 'download'
  | 'setting'
  | 'preview'
  | 'center'
/**
 * 双飞翼
 */
export default (props: any) => {
  const [type, setType] = useState<BtnTypes>('')

  const handleType = (val: BtnTypes) => {
    if (type === val) {
      setType('')
    } else {
      setType(val)
    }
  }

  return (
    <div className="container">
      <div className="left">
        <LeftAction type={type} handleType={handleType} />
        <Logo></Logo>
      </div>
      {type === 'coms' && (
        <div className="coms">
          <LeftSidebar />
        </div>
      )}
      <div className="content">{props.children}</div>
      {type === 'setting' && (
        <div className="setting">
          <RightSidebar />
        </div>
      )}
      <div className="right">
        <RightAction type={type} handleType={handleType} />
      </div>
    </div>
  )
}
