import { LayoutTwoTone } from '@ant-design/icons'
import * as React from 'react'
import './index.less'

export default () => {
  return (
    <div className="logo">
      <div className="title">
        <LayoutTwoTone />
        <span>R Generator</span>
        <a href="https://github.com/r-generator/page">
          <img
            alt="GitHub Repo stars"
            src="https://img.shields.io/github/stars/r-generator/page?style=flat-square"
          />
        </a>
      </div>
    </div>
  )
}
