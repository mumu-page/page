import React, { useState } from 'react';
import { Button, Col, Row } from "antd";
import { createFromIconfontCN } from "@ant-design/icons";
import { IconFont, componentList } from '../constants';

export default function () {
    const generator = (data: any[]) => {
        return data.map((item) => {
            return <div key={item.key}>
                <Button
                    className='title-btn'
                    style={{paddingLeft: 12}}
                    icon={<IconFont type={item.icon} />}
                    type='text'
                    size='large'
                    disabled>{item.title}</Button>
                <Row gutter={[6, 6]} style={{ padding: '0 12px 12px 12px' }}>
                    {
                        item.children && item.children.map((childItem: any) => {
                            return <Col span={12} key={childItem.key}>
                                <Button
                                    block
                                    type='default'
                                    icon={<IconFont type={childItem.icon} />}>
                                    {childItem.title}
                                </Button>
                            </Col>
                        })
                    }
                </Row>
            </div>
        })
    }
    return (
        <>
            {
                generator(componentList)
            }
        </>
    );
}
