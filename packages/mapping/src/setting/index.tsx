import React, { CSSProperties } from 'react'
import { Tabs } from 'antd'
import Property from './components/Property'
import Page from './components/Page'
import './index.less'

const { TabPane } = Tabs
export default function () {
  const style: CSSProperties = {
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    height: 'calc(100vh - 46px)',
    paddingTop: 16,
  }
  return (
    <Tabs className="setting" defaultActiveKey="1" centered>
      <TabPane tab="属性设置" key="1">
        <div style={style}>
          <Property />
        </div>
      </TabPane>
      <TabPane tab="画布设置" key="3">
        <div style={style}>
          <Page />
        </div>
      </TabPane>
    </Tabs>
  )
}
