import * as monaco from 'monaco-editor';

export interface CodeEditorInstanceProps {
    mount: (el: HTMLDivElement, code: string) => void,
    setCode: (code: string) => void,
    resetMount: (code: string) => void,
    editor?: monaco.editor.IStandaloneCodeEditor
}

export interface CodeEditorProps {
    code: string;
    options?: {[key: string]: any};
}