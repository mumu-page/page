import * as React from 'react'
import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import './index.less'

const CustomCollapse = (props: any) => {
  return (
    <Collapse
      {...props}
      className="site-collapse-custom-collapse"
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      {props.children}
    </Collapse>
  )
}
CustomCollapse.Panel = (props: any) => {
  return (
    <Collapse.Panel {...props} className="site-collapse-custom-panel">
      {props.children}
    </Collapse.Panel>
  )
}

export default CustomCollapse
