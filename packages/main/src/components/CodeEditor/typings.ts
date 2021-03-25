import * as monaco from "monaco-editor";

export interface CodeEditorInstanceProps {
  mount: (el: HTMLDivElement, code: string) => void;
  setCode: (code: string) => void;
  resetMount: (code: string) => void;
  editor?: monaco.editor.IStandaloneCodeEditor;
  onChangeCode?: (code: string) => void;
}

export interface CodeEditorProps {
  code: string;
  className?: string;
  style?: { [key: string]: any };
  options?: { [key: string]: any };
  onChangeCode?: (code?: string) => void;
}
