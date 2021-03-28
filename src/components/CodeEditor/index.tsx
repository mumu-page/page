import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  memo,
} from 'react'
import * as monaco from 'monaco-editor'
import { CodeEditorInstanceProps, CodeEditorProps } from './typings'
import { Spin } from 'antd'
import { isEqual } from 'lodash'
import './index.less'

/**
 * 编辑器不支持TSX，以下为了禁用语法错误的提示
 */
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

const defaultOptions = {
  theme: 'vs-dark',
  language: 'typescript',
  tabSize: 2,
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
      onChangeCode,
      className,
      style,
    } = props
    const [spinning, setSpinning] = useState(true)
    const element = useRef<HTMLDivElement>(null)
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
    const options = useMemo(() => ({ ...defaultOptions, ...optionProp }), [
      optionProp,
    ])

    const onLayoutChange = useCallback(() => {
      const { offsetHeight, offsetWidth } = element.current || {}
      if (offsetHeight && offsetWidth) {
        editor.current?.layout({
          width: offsetWidth,
          height: offsetHeight,
        })
      }
    }, [])

    const formatDocument = () => {
      let timer: any = setInterval(() => {
        const instance = editor.current
        const actionId = 'editor.action.formatDocument'
        const action = instance?.getAction?.(actionId)
        if (action?.isSupported?.()) {
          clearInterval(timer)
          timer = void 0
          action?.run?.()
        }
      })
    }

    const onDidChangeModelContent = () => {
      onChangeCode?.(editor.current?.getValue?.())
    }

    const create = useCallback(
      (el: HTMLElement | null, value: string, options = {}) => {
        if (!el) return
        setSpinning(true)
        const _options = {
          ...defaultOptions,
          ...options,
        }
        const editorInstance = (editor.current = monaco.editor.create(el, {
          value,
          ..._options,
        }))
        editorInstance.onDidChangeModelContent(onDidChangeModelContent)
        setSpinning(false)
        formatDocument()
      },
      [onChangeCode]
    )

    useImperativeHandle(
      ref,
      () => ({
        editor: editor.current,
        mount(el: HTMLDivElement, code: string) {
          create(el, code)
        },
        resetMount(code: string) {
          editor.current?.dispose()
          create(element.current, code)
        },
        setCode(code: string) {
          editor.current?.setValue(code)
        },
      }),
      [create]
    )

    useEffect(() => {
      create(element.current, code, options)
      window?.addEventListener('resize', onLayoutChange)
      return () => {
        editor.current?.dispose?.()
        editor.current = void 0
        window?.removeEventListener('resize', onLayoutChange)
      }
    }, [])

    return (
      <div
        style={style}
        className={
          className
            ? `code-editor-container ${className}`
            : 'code-editor-container'
        }
      >
        {/* 当编辑器插件还没没有加载完成，是没有dom样式的，所以不能直接包裹它 */}
        <Spin spinning={spinning} className="code-spinning" />
        <div className="code-editor" ref={element}></div>
      </div>
    )
  }
)

export default memo(CodeEditor, (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps)
})
