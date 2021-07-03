import { Monaco } from '@monaco-editor/react'

export interface CodeEditorInstanceProps {
  setCode: (code: string) => void
  editor?: Monaco // monaco.editor.IStandaloneCodeEditor;
}

export interface CodeEditorProps {
  code: string
  className?: string
  style?: Record<string, any>
  options?: Record<string, any>
  onChange?: (code?: string) => void
  onRun?: (code?: string) => void
  onCopy?: (code?: string) => void
}
