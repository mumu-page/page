import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { CodeEditorInstanceProps, CodeEditorProps } from "./typings";
import { Spin } from 'antd'
import './index.scss'

const defaultCode = ['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n')
const defaultOptions = {
    theme: 'vs-dark',
    language: 'typescript',
}
const CodeEditor = forwardRef((props: CodeEditorProps, ref: ((instance: CodeEditorInstanceProps) => void) | React.MutableRefObject<unknown> | null) => {
    const { code = defaultCode, options: optionProp = defaultOptions, onChangeCode } = props;
    const [spinning, setSpinning] = useState(false)
    const element = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
    const options = { ...defaultOptions, ...optionProp }
    const onLayoutChange = useCallback(() => {
        const { offsetHeight, offsetWidth } = element.current || {}
        if (offsetHeight && offsetWidth) {
            editor.current?.layout({
                width: offsetWidth,
                height: offsetHeight
            })
        }
    }, [])

    const create = (el: HTMLElement, value: string, options?: object) => {
        const _options = {
            ...defaultOptions,
            ...(options || {})
        }
        editor.current = monaco.editor.create(el, {
            value,
            ..._options,
        });
        editor.current.onDidChangeModelContent(listeners => {
            onChangeCode && onChangeCode(editor.current?.getValue())
        })
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
        },
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
        window?.addEventListener('resize', onLayoutChange)
        return () => {
            window?.removeEventListener('resize', onLayoutChange)
            editor.current?.dispose();
        };
    }, [])

    useEffect(() => {
        const { offsetHeight, offsetWidth } = element.current || {}
        if (offsetHeight && offsetWidth) {
            editor.current?.layout({
                width: offsetWidth,
                height: offsetHeight
            })
        }
    })

    return <Spin spinning={spinning}>
        <div className="code-editor" ref={element}></div>
    </Spin>
})
export default CodeEditor