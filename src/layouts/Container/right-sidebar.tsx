import React from 'react'
import { Tabs } from 'antd'
import {
  ComponentSetting,
  LayoutSetting,
  PageSetting,
} from '../../properties/antd'
import './index.less'

const { TabPane } = Tabs
export default function () {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="属性设置" key="1">
        <div className="form-properties">
          <ComponentSetting />
        </div>
      </TabPane>
      <TabPane tab="布局设置" key="2">
        <div className="form-properties">
          <LayoutSetting />
        </div>
      </TabPane>
      <TabPane tab="画布设置" key="3">
        <div className="form-properties">
          <PageSetting />
        </div>
      </TabPane>
    </Tabs>
  )
}
