import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Button, Tabs, Drawer } from "antd";
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
import './index.scss'

const { TabPane } = Tabs;

export default forwardRef(function (props: PreviewProps, ref: ((instance: PreviewInstanceProps) => void) | React.MutableRefObject<unknown> | null) {
    const { code } = props;
    const [visible, setVisible] = useState(false)
    const [activeKey, setActiveKey] = useState('tsx')
    const tsEditor = useRef<CodeEditorInstanceProps>(null)
    const scssEditor = useRef<CodeEditorInstanceProps>(null)

    const refresh = () => {

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
    }));

    return (
        <Drawer width='100%' visible={visible} closable={false}>
            <div className='preview'>
                <Tabs
                    tabBarGutter={5}
                    activeKey={activeKey}
                    className='code-container'
                    onChange={onTabChange}
                    tabBarStyle={{ height: '35px' }}
                    type="card">
                    <TabPane
                        tab={<div>
                            {activeKey === 'tsx' ? <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} /> : <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />}
                            <span>tsx</span>
                        </div>}
                        key="tsx"
                    >
                        <CodeEditor ref={tsEditor} code={code} options={{language: 'html'}} />
                    </TabPane>
                    <TabPane
                        tab={<div>
                            {activeKey === 'scss' ? <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} /> : <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />}
                            <span>scss</span>
                        </div>}
                        key="scss">
                        <CodeEditor ref={scssEditor} code={'.code-editor { width: 100%;height: 100%;}'} options={{language: 'scss'}} />
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
                </div>
            </div>
        </Drawer>
    );
})