import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import { Tabs, Drawer, message, Button, Affix } from "antd";
import { PreviewInstanceProps, PreviewProps } from "./typings";
import {
  FileTextOutlined,
  EditOutlined,
  CloseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import CodeEditor from "../CodeEditor";
import { CodeEditorInstanceProps } from "../CodeEditor/typings";
import { string2Component } from "../../utils/utils";
import SplitPane from "react-split-pane";
import ReactDOM from 'react-dom';
import "./index.less";

const { TabPane } = Tabs;
const SelectedIcon = () => (
  <EditOutlined style={{ color: "#f1fa8c", marginRight: "5px" }} />
);
const UnSelectedIcon = () => (
  <FileTextOutlined style={{ color: "#a95812", marginRight: "5px" }} />
);
const defaultSize = window.screen.width * 0.3;
export default forwardRef(function (
  props: PreviewProps,
  ref:
    | ((instance: PreviewInstanceProps) => void)
    | React.MutableRefObject<unknown>
    | null
) {
  const [tsxCode, setTsxCode] = useState<string>("");
  const [scssCode, setScssCode] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("tsx");
  const [component, setComponent] = useState(<></>);
  const tsxEditor = useRef<CodeEditorInstanceProps>(null);
  const scssEditor = useRef<CodeEditorInstanceProps>(null);
  const [width, setWidth] = useState<number | string>(defaultSize);

  const onTsxChangCode = useCallback((newCode) => {
    setTsxCode(newCode);
    // refresh(newCode)
  }, []);

  const onScssChangCode = useCallback((newCode) => {
    setScssCode(newCode);
    onRun(newCode);
  }, []);

  const onRun = (code = tsxCode) => {
    const _xmlCode =
      code
        .substring(code.indexOf("export default"), code.indexOf("</Form>"))
        .replace("export default", "") + "</Form>}";
    string2Component(_xmlCode)
      .then((newComponent) => {
        if (typeof newComponent === "function") {
          const Component = newComponent();
          setComponent(<Component />);
        }
      })
      .catch((info) => {
        message.error(info?.message);
      });
  };

  const onCopy = () => {
    console.log("onCopy");
  };

  const onDragFinished = (newSize: number) => {
    setWidth(newSize);
  };

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      tsEditor: tsxEditor.current,
      scssEditor: scssEditor.current,
      setTsxCode: (newCode: string) => {
        setTsxCode(newCode);
      },
      setScssCode: (newCode: string) => {
        setScssCode(newCode);
      },
      open() {
        setVisible(true);
      },
      close() {
        setVisible(false);
      },
      run(newCode: string) {
        onRun(newCode);
      },
    }),
    []
  );

  return (
    <Drawer
      width="100%"
      visible={visible}
      destroyOnClose
      closable={false}
      onClose={onClose}
    >
      <div className="preview">
        <SplitPane
          split="vertical"
          minSize={0}
          defaultSize={defaultSize}
          onDragFinished={onDragFinished}
        >
          <Tabs
            tabBarGutter={5}
            activeKey={activeKey}
            className="code-container"
            onChange={onTabChange}
            tabBarStyle={{ height: "35px" }}
            type="card"
            tabBarExtraContent={
              <Button
                icon={<PlayCircleOutlined />}
                style={{ color: "#999" }}
                type="link"
                size='small'
                onClick={() => onRun(tsxCode)}
              >
                运行
              </Button>
            }
          >
            <TabPane
              tab={
                <div>
                  {activeKey === "tsx" ? <SelectedIcon /> : <UnSelectedIcon />}
                  <span>tsx</span>
                </div>
              }
              key="tsx"
            >
              <CodeEditor
                ref={tsxEditor}
                code={tsxCode}
                options={{ width, height: "100vmax", language: "typescript" }}
                onChange={onTsxChangCode}
                onRun={onRun}
                onCopy={onCopy}
              />
            </TabPane>
            <TabPane
              tab={
                <div>
                  {activeKey === "scss" ? <SelectedIcon /> : <UnSelectedIcon />}
                  <span>scss</span>
                </div>
              }
              key="scss"
            >
              <CodeEditor
                ref={scssEditor}
                code={scssCode}
                options={{ width, height: "100vmax", language: "scss" }}
                onChange={onScssChangCode}
              />
            </TabPane>
          </Tabs>
          <div className="form">
            <div className="body">{component}</div>
            <Affix
              offsetBottom={10}
              style={{ position: "absolute", bottom: 20, right: 20 }}
            >
              <Button
                icon={<CloseOutlined />}
                shape="circle"
                type="text"
                style={{boxShadow: '0 0 2px #ccc'}}
                onClick={onClose}
              ></Button>
            </Affix>
          </div>
        </SplitPane>
      </div>
    </Drawer>
  );
});
