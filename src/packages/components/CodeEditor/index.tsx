import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';
import { CodeEditorProp } from "./typings";
import './index.scss'

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
        setCode(code: string) {
            editor.current?.setValue(code)
        }
    }))

    useEffect(() => {
        // console.log('useEffect')
        console.log('element.current', element.current)
        if (element.current) {
            create(element.current, ['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n'))
        }
        return () => {
            editor.current?.dispose();
        };
    }, []);

    return <div id="code-editor" ref={element}></div>;
})