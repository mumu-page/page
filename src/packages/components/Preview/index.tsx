import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal, Drawer } from "antd";
import { PreviewProp } from './typings'
import {
    SyncOutlined,
    VerticalAlignBottomOutlined,
    CopyOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import CodeEditor from "../CodeEditor";
import { CodeEditorProp } from "../CodeEditor/typings";
import './index.scss'

export default forwardRef(function (props, ref: ((instance: PreviewProp) => void) | React.MutableRefObject<unknown> | null) {
    const [visible, setVisible] = useState(false)
    const editor = useRef<CodeEditorProp>(null)

    const refresh = () => {
        editor.current?.setCode(['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n'))
    }

    const copy = () => {

    }

    const download = () => {

    }

    const close = () => {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
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
                <CodeEditor ref={editor} />
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