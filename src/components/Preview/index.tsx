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
import Compile from '../../utils/compile'
import SplitPane /* , { Pane } */ from 'react-split-pane'
import './index.less'
import { genrateList1 } from '../../utils/genrateList1'
import GenrateCode from '../../utils/genrate'
import { useStore } from '../../stores/utils'

const { TabPane } = Tabs
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
    const genrate = new GenrateCode(componentList, target)
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
                    <CodeEditor
                      code={genrateList1(fields)}
                      options={{
                        width,
                        height: '100vmax',
                        language: 'typescript',
                      }}
                    />
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
