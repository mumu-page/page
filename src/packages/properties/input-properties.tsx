import React, { useState } from 'react';
import { Form, Input, InputNumber, Radio, Switch } from "antd";
import { CommonProperties } from "./index";

type SizeType = Parameters<typeof Form>[0]['size'];
const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};
export default function () {
    const onValuesChange = (values: any) => {
        console.log('onValuesChange', values)
    };
    return (
        <>
            <CommonProperties />
            <Form
                {...layout}
                onValuesChange={onValuesChange}
            >
                 <Form.Item
                    label="输入框内容"
                    name="value">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="前置"
                    tooltip='带标签的 input，设置前置标签'
                    name="addonBefore">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="后置"
                    tooltip='带标签的 input，设置后置标签'
                    name="addonAfter">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="最大长度"
                    name="maxLength">
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="控件大小"
                    tooltip='注：标准表单内的输入框大小限制为 large'
                    name="size">
                    <Radio.Group>
                        <Radio.Button value="large">较大</Radio.Button>
                        <Radio.Button value="middle">中等</Radio.Button>
                        <Radio.Button value="small">迷你</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="点击清除"
                    tooltip="可以点击清除图标删除内容"
                    name="allowClear">
                    <Switch />
                </Form.Item>
                <Form.Item
                    label="显示边框"
                    tooltip="是否有边框"
                    name="bordered">
                    <Switch />
                </Form.Item>
                <Form.Item
                    label="是否禁用"
                    tooltip="是否禁用状态，默认为 false"
                    name="disabled">
                    <Switch />
                </Form.Item>
            </Form>
        </>
    );
}