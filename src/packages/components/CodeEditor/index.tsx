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
import "./index.scss";
import { isEqual } from "lodash";

// const defaultCode = ['function x() {', '\tconsole.log("Hello world! 111");', '}'].join('\n')
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

    const create = useCallback(
      (el: HTMLElement, value: string, options?: object) => {
        const _options = {
          ...defaultOptions,
          ...(options || {}),
        };
        editor.current = monaco.editor.create(el, {
          value,
          ..._options,
        });
        editor.current.onDidChangeModelContent((_listeners) => {
          onChangeCode && onChangeCode(editor.current?.getValue());
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
      editor.current?.setValue(code);
    }, [code]);

    useEffect(() => {
      setSpinning(true);
      setTimeout(() => {
        if (element.current) {
          editor.current?.dispose();
          create(element.current, code, options);
          setSpinning(false);
        }
      });
      window?.addEventListener("resize", onLayoutChange);
      return () => {
        window?.removeEventListener("resize", onLayoutChange);
        editor.current?.dispose();
      };
    }, [code, create, onLayoutChange, options]);

    useEffect(() => {
      const { offsetHeight, offsetWidth } = element.current || {};
      if (offsetHeight && offsetWidth) {
        editor.current?.layout({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    });

    return (
      <>
        {/* 当编辑器插件还没没有加载完成，是没有dom样式的，所以不能直接包裹它 */}
        <Spin
          spinning={spinning}
          style={{
            backgroundColor: "#1e1e1e",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <div className="code-editor" ref={element}></div>
      </>
    );
  }
);

export default memo(CodeEditor, (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps);
});
