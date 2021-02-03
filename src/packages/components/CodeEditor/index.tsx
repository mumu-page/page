import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
import { CodeEditorInstanceProps, CodeEditorProps } from "./typings";
import { Spin } from 'antd'
import './index.scss'

const defaultCode = ['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n')
const defaultOptions = {
    theme: 'vs-dark',
    language: 'typescript',
}
export default forwardRef((props: CodeEditorProps, ref: ((instance: CodeEditorInstanceProps) => void) | React.MutableRefObject<unknown> | null) => {
    const { code = defaultCode, options: optionProp = defaultOptions } = props;
    const [spinning, setSpinning] = useState(false)
    const element = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
    const options = {...defaultOptions, ...optionProp}

    const create = (el: HTMLElement, value: string, options?: object) => {
        const _options = {
            ...defaultOptions,
            ...(options || {})
        }
        editor.current = monaco.editor.create(el, {
            value,
            ..._options
        });
    }

    useImperativeHandle(ref, () => ({
        editor: editor.current,
        mount(el: HTMLDivElement, code: string) {
            create(el, code)
        },
        resetMount(code: string) {
            if (element.current) {
                editor.current?.dispose();
                create(element.current, code)
            }
        },
        setCode(code: string) {
            editor.current?.setValue(code)
        }
    }))

    useEffect(() => {
        setSpinning(true)
        setTimeout(() => {
            editor.current?.setValue(code)
            setSpinning(false)
        })
    }, [code])

    useEffect(() => {
        setSpinning(true)
        setTimeout(() => {
            if (element.current) {
                editor.current?.dispose();
                create(element.current, code, options)
                setSpinning(false)
            }
        })
        return () => {
            editor.current?.dispose();
        };
    }, [])

    return <Spin spinning={spinning}>
        <div className="code-editor" ref={element}></div>
    </Spin>
})