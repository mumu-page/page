import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
import { CodeEditorProp } from "./typings";
import './index.scss'

const defaultCode = ['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n')
export default forwardRef((props, ref: ((instance: CodeEditorProp) => void) | React.MutableRefObject<unknown> | null) => {
    const element = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>()

    const create = (el: HTMLElement, value: string, options?: object) => {
        const _options = {
            theme: 'vs-dark',
            language: 'typescript',
            ...(options || {})
        }
        editor.current = monaco.editor.create(el, {
            value,
            ..._options
        });
    }

    useImperativeHandle(ref, () => ({
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
        setTimeout(() => {
            editor.current?.dispose();
            if (element.current) {
                create(element.current, defaultCode)
            }
        })

        return () => {
            editor.current?.dispose();
        };
    }, [])

    return <div className="code-editor" ref={element}></div>;
})