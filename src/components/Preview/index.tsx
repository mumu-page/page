import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { Tabs, Drawer, message, Button, Space, Divider } from 'antd'
import { PreviewInstanceProps, PreviewProps } from './typings'
import {
  FileTextOutlined,
  EditOutlined,
  CloseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import CodeEditor from '../CodeEditor'
import { CodeEditorInstanceProps } from '../CodeEditor/typings'
import { string2Component } from '../../utils/utils'
import SplitPane /* , { Pane } */ from 'react-split-pane'
import './index.less'
import { getList1 } from './utils'
import { useStore } from '../../hooks'

const { TabPane } = Tabs
const SelectedIcon = () => (
  <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} />
)
const UnSelectedIcon = () => (
  <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />
)

export default forwardRef(function (
  props: PreviewProps,
  ref:
    | ((instance: PreviewInstanceProps) => void)
    | React.MutableRefObject<unknown>
    | null
) {
  const [tsxCode, setTsxCode] = useState<string>('')
  const [lessCode, setScssCode] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('tsx')
  const [component, setComponent] = useState(<></>)
  const tsxEditor = useRef<CodeEditorInstanceProps>(null)
  const lessEditor = useRef<CodeEditorInstanceProps>(null)
  const [width, setWidth] = useState<number | string>('')
  const { componentList } = useStore()
  const showList1 = componentList?.some?.(
    (item) => item.componentKey === 'List1'
  )

  const onTsxChangCode = useCallback((newCode) => {
    setTsxCode(newCode)
    // refresh(newCode)
  }, [])

  const onScssChangCode = useCallback((newCode) => {
    setScssCode(newCode)
    onRun(newCode)
  }, [])

  const onRun = (code = tsxCode) => {
    const _xmlCode =
      code
        .substring(code.indexOf('export default'), code.indexOf('</Form>'))
        .replace('export default', '') + '</Form>}'
    string2Component(_xmlCode)
      .then((newComponent) => {
        if (typeof newComponent === 'function') {
          const Component = newComponent()
          setComponent(<Component />)
        }
      })
      .catch((info) => {
        message.error(info?.message)
      })
  }

  const onCopy = () => {
    console.log('onCopy')
  }

  const onDragFinished = (newSize: number) => {
    setWidth(newSize)
  }

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey)
  }

  const onClose = () => {
    setVisible(false)
  }

  useImperativeHandle(
    ref,
    () => ({
      tsEditor: tsxEditor.current,
      lessEditor: lessEditor.current,
      setTsxCode: (newCode: string) => {
        setTsxCode(newCode)
      },
      setScssCode: (newCode: string) => {
        setScssCode(newCode)
      },
      open() {
        setVisible(true)
      },
      close() {
        setVisible(false)
      },
      run(newCode: string) {
        onRun(newCode)
      },
    }),
    []
  )

  useEffect(() => {
    const defaultSize = window.screen.width * 0.3
    setWidth(defaultSize)
  }, [])

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
          defaultSize={width}
          onDragFinished={onDragFinished}
        >
          <Tabs
            tabBarGutter={5}
            activeKey={activeKey}
            className="code-container"
            onChange={onTabChange}
            tabBarStyle={{ height: '35px' }}
            type="card"
            tabBarExtraContent={
              <Space className="extra-action-container" split={<Divider />}>
                <Button
                  icon={<PlayCircleOutlined />}
                  type="link"
                  size="small"
                  className="extra-action"
                  onClick={() => onRun(tsxCode)}
                >
                  运行
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  className="extra-action"
                  type="link"
                  size="small"
                  onClick={onClose}
                >
                  关闭
                </Button>
                <div></div>
              </Space>
            }
          >
            <TabPane
              tab={
                <div>
                  {activeKey === 'tsx' ? <SelectedIcon /> : <UnSelectedIcon />}
                  <span>index.tsx</span>
                </div>
              }
              key="tsx"
            >
              <CodeEditor
                ref={tsxEditor}
                code={tsxCode}
                options={{ width, height: '100vmax', language: 'typescript' }}
                onChange={onTsxChangCode}
                onRun={onRun}
                onCopy={onCopy}
              />
            </TabPane>
            {showList1 && (
              <TabPane
                tab={
                  <div>
                    {activeKey === 'List1' ? (
                      <SelectedIcon />
                    ) : (
                      <UnSelectedIcon />
                    )}
                    <span>List1.tsx</span>
                  </div>
                }
                key="List1"
              >
                <CodeEditor
                  code={getList1()}
                  options={{ width, height: '100vmax', language: 'typescript' }}
                />
              </TabPane>
            )}
            {/* <TabPane
              tab={
                <div>
                  {activeKey === 'less' ? <SelectedIcon /> : <UnSelectedIcon />}
                  <span>index.less</span>
                </div>
              }
              key="less"
            >
              <CodeEditor
                ref={lessEditor}
                code={lessCode}
                options={{ width, height: '100vmax', language: 'less' }}
                onChange={onScssChangCode}
              />
            </TabPane> */}
          </Tabs>
          <div className="form">
            <div className="body">{component}</div>
          </div>
        </SplitPane>
      </div>
    </Drawer>
  )
})
