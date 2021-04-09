import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  memo,
} from "react";
import MonacoEditor, { monaco } from "react-monaco-editor";
import { CodeEditorInstanceProps, CodeEditorProps } from "./typings";
import { isEqual, merge } from "lodash";
import "./index.less";

/**
 * 删除不需要的菜单
 */
function removeContextMenu() {
  let menus = require("monaco-editor/esm/vs/platform/actions/common/actions")
    .MenuRegistry._menuItems;
  let contextMenuEntry = [...menus].find(
    (entry) => entry[0]._debugName === "EditorContext"
  );
  let contextMenuLinks = contextMenuEntry[1];
  let removableIds = [
    "editor.action.goToTypeDefinition",
    "editor.action.goToReferences",
    "editor.action.peekDeclaration",
    "editor.action.peekDefinition",
    "editor.action.peekImplementation",
    "editor.action.peekTypeDefinition",
    "editor.action.quickOutline",
    "editor.action.quickCommand",
    "editor.action.changeAll",
    "editor.action.revealDefinition",
    "editor.action.referenceSearch.trigger",
    // "editor.action.formatDocument",
  ];
  let removeById = (
    list: { _first: any; _remove: (arg0: any) => void },
    ids: string | any[]
  ) => {
    let node = list._first;
    do {
      let shouldRemove = ids.includes(node.element?.command?.id);
      if (shouldRemove) {
        list._remove(node);
      }
    } while ((node = node.next));
  };

  removeById(contextMenuLinks, removableIds);
}
removeContextMenu()
/**
 * 编辑器不支持TSX，以下为了禁用语法错误的提示
 */
function compatibleTSX() {
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
}
compatibleTSX();

const defaultOptions = {
  theme: "vs-dark",
  language: "typescript",
  tabSize: 2,
  width: 800,
  height: 600,
};
const CodeEditor = forwardRef(
  (
    props: CodeEditorProps,
    ref:
      | ((instance: CodeEditorInstanceProps) => void)
      | React.MutableRefObject<unknown>
      | null
  ) => {
    const { code = "", options: optionProp = defaultOptions, onChange, onRun, onCopy } = props;
    const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
    const options = merge(defaultOptions, optionProp)

    useImperativeHandle(
      ref,
      () => ({
        editor: editor.current,
        setCode(code: string) {
          editor.current?.setValue(code);
        },
      }),
      []
    );

    const editorDidMount = (
      _editor: monaco.editor.IStandaloneCodeEditor,
      monaco: any
    ) => {
      // console.log("editorDidMount", editor);
      editor.current = _editor;
      _editor.focus();
      _editor.addAction({
        id: "run",
        label: "运行",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
        contextMenuGroupId: "run",
        contextMenuOrder: 1,
        run: function (ed) {
          onRun?.(ed.getValue())
        },
      });
      _editor.addAction({
        id: "copy all",
        label: "复制全部",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10],
        contextMenuGroupId: "copy all",
        contextMenuOrder: 2,
        run: function (ed) {
          onCopy?.(ed.getValue())
        },
      });
      setTimeout(() => {
        _editor?.getAction("editor.action.formatDocument")?.run();
      }, 300);
    };

    return (
      <MonacoEditor
        width={options.width}
        height={options.height}
        language={options.language}
        theme={options.theme}
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    );
  }
);

export default memo(CodeEditor, (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps);
});
