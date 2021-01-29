import React, { useContext } from 'react';
import { Tabs } from "antd";
import { FormProperties, ComponentProperties } from '../properties/'
import { Context } from '../stores/context';

const { TabPane } = Tabs;
export default function () {
    
    return (
        <Tabs defaultActiveKey="1" centered>
            <TabPane tab="组件属性" key="1">
                <div className='component-properties'>
                    <ComponentProperties />
                </div>
            </TabPane>
            <TabPane tab="表单属性" key="2">
                <div className='form-properties'>
                    <FormProperties />
                </div>
            </TabPane>
        </Tabs>
    );
}
