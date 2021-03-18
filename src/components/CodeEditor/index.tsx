import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  memo,
} from "react";
import * as monaco from "monaco-editor";
import { CodeEditorInstanceProps, CodeEditorProps } from "./typings";
import { Spin } from "antd";
import { isEqual } from "lodash";
import "./index.scss";

// 禁用了语法错误，但无法获得语法高亮支持 tsx
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.Latest,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  esModuleInterop: true,
  jsx: monaco.languages.typescript.JsxEmit.React,
  reactNamespace: "React",
  allowJs: true,
  typeRoots: ["node_modules/@types"],
});
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});
const defaultOptions = {
  theme: "vs-dark",
  language: "typescript",
};
const CodeEditor = forwardRef(
  (
    props: CodeEditorProps,
    ref:
      | ((instance: CodeEditorInstanceProps) => void)
      | React.MutableRefObject<unknown>
      | null
  ) => {
    const {
      code = "",
      options: optionProp = defaultOptions,
      onChangeCode,
      className,
      style,
    } = props;
    const [spinning, setSpinning] = useState(true);
    const element = useRef<HTMLDivElement>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
    const options = useMemo(() => ({ ...defaultOptions, ...optionProp }), [
      optionProp,
    ]);

    const onLayoutChange = useCallback(() => {
      const { offsetHeight, offsetWidth } = element.current || {};
      if (offsetHeight && offsetWidth) {
        editor.current?.layout({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }, []);

    const formatDocument = () => {
      editor.current?.getAction?.("editor.action.formatDocument")?.run?.();
    };

    const create = useCallback(
      (el: HTMLElement, value: string, options = {}) => {
        const _options = {
          ...defaultOptions,
          ...options,
        };
        editor.current = monaco.editor.create(el, {
          value,
          ..._options,
        });
        setTimeout(() => {
          if (editor.current) {
            formatDocument();
          }
        }, 300);
        editor.current.onDidChangeModelContent(() => {
          onChangeCode?.(editor.current?.getValue?.());
        });
      },
      [onChangeCode]
    );

    useImperativeHandle(
      ref,
      () => ({
        editor: editor.current,
        mount(el: HTMLDivElement, code: string) {
          create(el, code);
        },
        resetMount(code: string) {
          if (element.current) {
            editor.current?.dispose();
            create(element.current, code);
          }
        },
        setCode(code: string) {
          editor.current?.setValue(code);
        },
      }),
      [create]
    );

    useEffect(() => {
      setSpinning(true);
      if (element.current) {
        create(element.current, code, options);
        setSpinning(false);
      }
      window?.addEventListener("resize", onLayoutChange);
      return () => {
        editor.current?.dispose?.();
        editor.current = undefined;
        window?.removeEventListener("resize", onLayoutChange);
      };
    }, []);

    return (
      <div
        style={style}
        className={
          className
            ? `code-editor-container ${className}`
            : "code-editor-container"
        }
      >
        {/* 当编辑器插件还没没有加载完成，是没有dom样式的，所以不能直接包裹它 */}
        <Spin spinning={spinning} className="code-spinning" />
        <div className="code-editor" ref={element}></div>
      </div>
    );
  }
);

export default memo(CodeEditor, (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps);
});
