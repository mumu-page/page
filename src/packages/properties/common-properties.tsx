import React, { useState } from 'react';
import { Form, Input, Slider } from "antd";

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};

/**
 * 部分组件的公用属性设置
 */
export default function () {
    const onValuesChange = ({ component: componentType, name, size }: { component: React.ReactDOM, name: string, size: string }) => {
    };
    return (
        <>
            <Form
                {...layout}
                initialValues={{}}
                onValuesChange={onValuesChange}
            >
                <Form.Item
                    label="占位提示"
                    name="placeholder">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="表单栅格"
                    tooltip='需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。'
                    name="wrapperCol">
                    <Slider defaultValue={30} marks={{ 0: '0', 12: '12', 24: '24' }} max={24} />
                </Form.Item>
                <Form.Item
                    label="标签布局"
                    tooltip='label 标签布局，同 <Col> 组件'
                    name="labelCol">
                    <Slider defaultValue={30} marks={{ 0: '0', 12: '12', 24: '24' }} max={24} />
                </Form.Item>
                <Form.Item
                    label="组件宽度"
                    name="componentWidth">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="默认值"
                    name="defaultValue">
                    <Input />
                </Form.Item>
            </Form>
        </>
    );
}