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
                initialValues={{
                    wrapperCol: 30,
                    labelCol: 30,
                }}
                onValuesChange={onValuesChange}
            >
                <Form.Item
                    label="占位提示"
                    name="placeholder">
                    <Input />
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