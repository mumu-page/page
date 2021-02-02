export interface CodeEditorProp {
    mount: (el?: HTMLDivElement, code?: string) => void,
    setCode: (code: string) => void,
    resetMount: (code: string) => void,
}