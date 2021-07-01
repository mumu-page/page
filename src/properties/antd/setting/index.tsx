import React from 'react'
import { Tabs } from 'antd'
import './index.less'
import Component from './component'
import Layout from './layout'
import Page from './page'

const { TabPane } = Tabs
export default function () {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="属性设置" key="1">
        <div className="form-properties">
          <Component />
        </div>
      </TabPane>
      <TabPane tab="布局设置" key="2">
        <div className="form-properties">
          <Layout />
        </div>
      </TabPane>
      <TabPane tab="画布设置" key="3">
        <div className="form-properties">
          <Page />
        </div>
      </TabPane>
    </Tabs>
  )
}
