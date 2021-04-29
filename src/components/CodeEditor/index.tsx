import React, { useRef, forwardRef, useImperativeHandle, memo } from 'react'
import MonacoEditor, { Monaco, OnMount } from '@monaco-editor/react'
import { CodeEditorInstanceProps, CodeEditorProps } from './typings'
import { isEqual, merge } from 'lodash'
import './index.less'

/**
 * 编辑器不支持TSX，以下为了禁用语法错误的提示
 */
function compatibleTSX(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  })
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })
}

const defaultOptions = {
  theme: 'vs-dark',
  language: 'typescript',
  tabSize: 2,
  width: 800,
  height: 600,
}
const CodeEditor = forwardRef(
  (
    props: CodeEditorProps,
    ref:
      | ((instance: CodeEditorInstanceProps) => void)
      | React.MutableRefObject<unknown>
      | null
  ) => {
    const {
      code = '',
      options: optionProp = defaultOptions,
      onChange,
      onRun,
      onCopy,
    } = props
    const editorRef = useRef<any>()
    const options = merge(defaultOptions, optionProp)

    useImperativeHandle(
      ref,
      () => ({
        editor: editorRef.current,
        setCode(code: string) {
          editorRef.current?.setValue(code)
        },
      }),
      []
    )

    function handleEditorWillMount(monaco: Monaco) {
      compatibleTSX(monaco)
    }

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      //   console.log('editorDidMount', editor)
      editorRef.current = editor
      editor.focus()
      editor.addAction({
        id: 'run',
        label: '运行',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
        contextMenuGroupId: 'run',
        contextMenuOrder: 1,
        run: function (ed) {
          onRun?.(ed.getValue())
        },
      })
      editor.addAction({
        id: 'copy all',
        label: '复制全部',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
        contextMenuGroupId: 'copy all',
        contextMenuOrder: 2,
        run: function (ed) {
          onCopy?.(ed.getValue())
        },
      })
      setTimeout(() => {
        editor?.getAction('editor.action.formatDocument')?.run()
      }, 300)
    }

    return (
      <MonacoEditor
        width={options.width}
        height={options.height}
        language={options.language}
        theme={options.theme}
        value={code}
        options={options}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    )
  }
)

export default memo(CodeEditor, (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps)
})
