import React, { useContext } from 'react';
import { Button, Col, Row, Form, Input } from "antd";
import { IconFont, options } from '../constants';
import { Context } from "../stores/context";
import { PUT_COMPONENT_LIST, SET_CURRENT_DRAG_COMPONENT, SET_FLAG, SET_SHOW_NOT_FOUNT } from '../stores/action-type';

export default () => {
    const { flag, commonDispatch } = useContext(Context)

    const generator = (data: any[]) => {
        return data.map((item) => {
            return <div
                key={item.key}
                onDragEnter={(e) => {
                    if (flag) {
                        commonDispatch({ type: SET_FLAG, payload: false })
                    }
                }}
            >
                <Button
                    className='title-btn'
                    style={{ paddingLeft: 12 }}
                    icon={<IconFont type={item.icon} />}
                    type='text'
                    size='large'
                    disabled>{item.label}</Button>
                <Row gutter={[6, 6]} style={{ padding: '0 12px 12px 12px' }}>
                    {
                        item.children && item.children.map((childItem: any) => {
                            return <Col span={12} key={childItem.key}>
                                <Button
                                    block
                                    type='default'
                                    onDragEnd={(e) => {
                                        commonDispatch({
                                            type: SET_CURRENT_DRAG_COMPONENT, payload: {
                                                componentKey: childItem.value,
                                                formItemProp: {},
                                                componentProp: {}
                                            }
                                        })
                                        commonDispatch({
                                            type: PUT_COMPONENT_LIST, payload: {
                                                componentKey: childItem.value,
                                                formItemProp: {},
                                                componentProp: {}
                                            }
                                        })
                                        if (flag) {
                                            commonDispatch({ type: SET_FLAG, payload: false })
                                            commonDispatch({ type: SET_SHOW_NOT_FOUNT, payload: false })
                                        }
                                    }}
                                    draggable
                                    icon={<IconFont type={childItem.icon} />}>
                                    {childItem.label}
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
                generator(options)
            }
        </>
    );
}
