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
} from '@ant-design/icons'
import { CodeEditorInstanceProps } from '../CodeEditor/typings'
import Compile from '../../utils/compile'
import SplitPane /* , { Pane } */ from 'react-split-pane'
import { genrateList1 } from '../../utils/genrateList1'
import { Generate, Store } from '@r-generate/core'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'highlight.js/styles/github.css'
import './index.less'

const { useStore } = Store.Hooks
const { TabPane } = Tabs
const customStyle = {
  marginTop: 0,
  height: 'calc(100vh - 35px)',
  overflowY: 'auto',
}
const SelectedIcon = () => (
  <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} />
)
const UnSelectedIcon = () => (
  <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />
)

export default forwardRef<PreviewInstanceProps, PreviewProps>(function (
  props,
  ref
) {
  const [tsxCode, setTsxCode] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('tsx')
  const [component, setComponent] = useState(<></>)
  const tsxEditor = useRef<CodeEditorInstanceProps>(null)
  const lessEditor = useRef<CodeEditorInstanceProps>(null)
  const [width, setWidth] = useState<number | string>('')
  const { componentList, target } = useStore()
  // 列表组件数据，根据它生成tab
  const list = componentList?.filter?.((item) => item.componentKey === 'List1')

  const onTsxChangCode = useCallback((newCode) => {
    setTsxCode(newCode)
    // onRun(newCode)
  }, [])

  const onRun = (code?: string) => {
    const genrate = new Generate.Generate(componentList, target)
    if (code) {
      setTsxCode(code)
    } else {
      setTsxCode(genrate.generate())
    }
    new Compile(genrate).string2Component(list, code).then((newComponent) => {
      if (typeof newComponent === 'function') {
        const Component = newComponent()
        setComponent(<Component />)
      }
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
    setActiveKey('tsx')
  }

  useImperativeHandle(
    ref,
    () => ({
      tsxEditor: tsxEditor.current,
      lessEditor: lessEditor.current,
      setTsxCode,
      open() {
        setVisible(true)
      },
      close: onClose,
      run() {
        onRun()
      },
    }),
    [componentList, target]
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
              <SyntaxHighlighter
                language="tsx"
                style={tomorrow}
                showLineNumbers
                wrapLines
                // wrapLongLines
                customStyle={customStyle}
              >
                {tsxCode}
              </SyntaxHighlighter>
            </TabPane>
            {list.length &&
              list.map((item) => {
                const { componentProps, id } = item
                const { fields = [] } = componentProps || {}
                return (
                  <TabPane
                    tab={
                      <div>
                        {activeKey === id ? (
                          <SelectedIcon />
                        ) : (
                          <UnSelectedIcon />
                        )}
                        <span>List1-{String(id).slice(0, 4)}.tsx</span>
                      </div>
                    }
                    key={id}
                  >
                    <SyntaxHighlighter
                      language="tsx"
                      style={tomorrow}
                      showLineNumbers
                      wrapLines
                      // wrapLongLines
                      customStyle={customStyle}
                    >
                      {genrateList1(fields)}
                    </SyntaxHighlighter>
                  </TabPane>
                )
              })}
          </Tabs>
          <div className="form">
            <div className="body">{component}</div>
          </div>
        </SplitPane>
      </div>
    </Drawer>
  )
})
