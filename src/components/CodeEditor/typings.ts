import * as monaco from "monaco-editor";

export interface CodeEditorInstanceProps {
  setCode: (code: string) => void;
  editor?: monaco.editor.IStandaloneCodeEditor;
}

export interface CodeEditorProps {
  code: string;
  className?: string;
  style?: { [key: string]: any };
  options?: { [key: string]: any };
  onChange?: (code?: string) => void;
  onRun?: (code?: string) => void;
  onCopy?: (code?: string) => void;
}
