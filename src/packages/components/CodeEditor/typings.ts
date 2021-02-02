export interface CodeEditorProp {
    mount: (el?: HTMLDivElement, code?: string) => void,
    setCode: (code: string) => void,
}