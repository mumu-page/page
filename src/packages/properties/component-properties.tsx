import React, { useState } from 'react';
import { Form, Select, Input } from "antd";
import { componentList } from '../constants';

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};
const { Option, OptGroup } = Select;
export default function () {
    const [componentProperties, setComponent] = useState<React.ReactNode>(<></>)
    const onFormLayoutChange = ({ component: componentType, name, size }: { component: React.ReactDOM, name: string, size: string }) => {
        setComponent(componentType)
    };
    return (
        <>
            <Form
                {...layout}
                initialValues={{}}
                onValuesChange={onFormLayoutChange}
            >
                <Form.Item
                    label="组件类型"
                    name="component">
                    <Select>
                        {componentList.map(item => {
                            return <OptGroup label={item.title} key={item.key}>
                                {Array.isArray(item.children) && item.children.map(item => {
                                    return <Option key={item.key} value={item.component as any}>{item.title}</Option>
                                })}
                            </OptGroup>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="字段名"
                    name="name">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="标题"
                    name="size">
                    <Input />
                </Form.Item>
            </Form>
            {componentProperties}
        </>
    );
}