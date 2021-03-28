import { LayoutTwoTone } from '@ant-design/icons'
import React from 'react'
import './index.less'

export default () => {
  return (
    <div className="logo">
      <div className="title">
        <LayoutTwoTone />
        <span style={{ marginLeft: '5px' }}>Form Generator</span>
      </div>
      <a href="https://gitee.com/resonances/react-visual-editor">
        <img
          width={16}
          src="https://gitee.com/resonances/react-visual-editor/widgets/widget_5.svg?color=00aeff"
          alt="Fork me on Gitee"
        ></img>
      </a>
    </div>
  )
}
