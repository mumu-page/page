import { CodeEditorInstanceProps } from "../CodeEditor/typings";

export interface PreviewInstanceProps {
    open: () => void,
    close: () => void,
    tsEditor: CodeEditorInstanceProps,
    scssEditor: CodeEditorInstanceProps,
}

export interface PreviewProps {
    tsxCode: string;
    scssCode: string;
}