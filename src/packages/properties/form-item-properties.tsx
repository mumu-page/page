import React, { useContext, useState } from 'react';
import { Form, Input, Slider } from "antd";
import { Context } from '../stores/context';
import { SET_CURRENT_DRAG_COMPONENT } from '../stores/action-type';

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};

/**
 * 部分组件的公用属性设置
 */
export default function () {
    const { commonDispatch } = useContext(Context)

    const onValuesChange = (changedValues: any, allValues: any) => {
        const {wrapperCol, labelCol} = allValues
        commonDispatch({ type: SET_CURRENT_DRAG_COMPONENT, payload: {
            formItemProp: {
                ...allValues,
                wrapperCol: {span: wrapperCol},
                labelCol: {span: labelCol},
            },
        }})
    };
    return (
        <>
            <Form
                {...layout}
                initialValues={{
                    wrapperCol: 24,
                    labelCol:4,
                }}
                onValuesChange={onValuesChange}
            >
                <Form.Item
                    label="字段名"
                    name="name">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="标题"
                    name="label">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="表单栅格"
                    tooltip='需要为输入控件设置布局样式时，使用该属性，用法同 标签布局。'
                    name="wrapperCol">
                    <Slider marks={{ 0: '0', 12: '12', 24: '24' }} max={24} />
                </Form.Item>
                <Form.Item
                    label="标签布局"
                    tooltip='label 标签布局，同 <Col> 组件'
                    name="labelCol">
                    <Slider marks={{ 0: '0', 12: '12', 24: '24' }} max={24} />
                </Form.Item>
            </Form>
        </>
    );
}