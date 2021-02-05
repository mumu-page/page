import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Button, Tabs, Drawer, message } from "antd";
import { PreviewInstanceProps, PreviewProps } from './typings'
import {
    SyncOutlined,
    VerticalAlignBottomOutlined,
    CopyOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    EditOutlined
} from "@ant-design/icons";
import CodeEditor from "../CodeEditor";
import { CodeEditorInstanceProps } from "../CodeEditor/typings";
import { string2Component } from "../../utils/utils";
import './index.scss'

const { TabPane } = Tabs;
export default forwardRef(function (props: PreviewProps, ref: ((instance: PreviewInstanceProps) => void) | React.MutableRefObject<unknown> | null) {
    const { tsxCode: tsxCodeProp, scssCode: scssCodeProp } = props;
    const [tsxCode, setTsxCode] = useState<string | undefined>(tsxCodeProp)
    const [scssCode, setScssCode] = useState<string | undefined>(scssCodeProp)
    const [visible, setVisible] = useState(false)
    const [activeKey, setActiveKey] = useState('tsx')
    const tsEditor = useRef<CodeEditorInstanceProps>(null)
    const scssEditor = useRef<CodeEditorInstanceProps>(null)
    const [component, setComponent] = useState(<></>)

    const refresh = () => {
        string2Component(tsxCode).then(newComponent => {
            setComponent(newComponent)
        }).catch(info => {
            message.error(info)
        })
    }

    const copy = () => {

    }

    const download = () => {

    }

    const close = () => {
        setActiveKey('tsx')
        setVisible(false)
    }

    const onTabChange = (activeKey: string) => {
        setActiveKey(activeKey)
    }

    useImperativeHandle(ref, () => ({
        tsEditor: tsEditor.current,
        scssEditor: scssEditor.current,
        open() {
            setVisible(true)
        },
        close() {
            setVisible(false)
        },
    }), []);

    useEffect(() => {
        setTsxCode(tsxCodeProp)
    }, [tsxCodeProp])

    useEffect(() => {
        setScssCode(scssCodeProp)
    }, [scssCodeProp])

    useEffect(() => {
        string2Component(tsxCodeProp).then(newComponent => {
            setComponent(newComponent)
        }).catch(info => {
            message.error(info)
        })
    }, [tsxCodeProp])

    useEffect(() => {
        
    }, [scssCode])

    return (
        <Drawer
            width='100%'
            visible={visible}
            closable={false}
            destroyOnClose>
            <div className='preview'>
                <Tabs
                    tabBarGutter={5}
                    activeKey={activeKey}
                    className='code-container'
                    onChange={onTabChange}
                    tabBarStyle={{ height: '35px' }}
                    type="card">
                    <TabPane
                        forceRender
                        tab={<div>
                            {activeKey === 'tsx' ? <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} /> : <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />}
                            <span>tsx</span>
                        </div>}
                        key="tsx"
                    >
                        <CodeEditor
                            ref={tsEditor}
                            code={tsxCodeProp}
                            options={{ language: 'html' }}
                            onChangeCode={(newCode) => {
                                setTsxCode(newCode)
                            }}
                        />
                    </TabPane>
                    <TabPane
                        forceRender
                        tab={<div>
                            {activeKey === 'scss' ? <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} /> : <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />}
                            <span>scss</span>
                        </div>}
                        key="scss">
                        <CodeEditor
                            ref={scssEditor}
                            code={scssCodeProp}
                            options={{ language: 'scss' }}
                            onChangeCode={(newCode) => {
                                setScssCode(newCode)
                            }}
                        />
                    </TabPane>
                </Tabs>
                <div className='form'>
                    <div className="head">
                        <Button icon={<SyncOutlined />} type="link" size='middle' onClick={refresh}>
                            刷新
                        </Button>
                        <Button icon={<VerticalAlignBottomOutlined />} type="link" size='middle' onClick={download}>
                            导出TSX文件
                        </Button>
                        <Button icon={<CopyOutlined />} type="link" size="middle" onClick={copy}>
                            复制代码
                        </Button>
                        <Button
                            icon={<CloseCircleOutlined />}
                            type="link"
                            size="middle"
                            danger
                            onClick={close}>
                            关闭
                        </Button>
                    </div>
                    <div className='body'>
                        {component}
                    </div>
                </div>
            </div>
        </Drawer>
    );
})