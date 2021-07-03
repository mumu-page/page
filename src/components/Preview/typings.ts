import { CodeEditorInstanceProps } from '../CodeEditor/typings'

export interface PreviewInstanceProps {
  open: () => void
  close: () => void
  tsxEditor: CodeEditorInstanceProps | null
  lessEditor: CodeEditorInstanceProps | null
  setTsxCode: React.Dispatch<React.SetStateAction<string>>
  setLessCode?: React.Dispatch<React.SetStateAction<string>>
  run: () => void
}

export interface PreviewProps {}
