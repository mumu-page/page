import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react'
import { Button, Tabs, Drawer, message } from 'antd'
import { PreviewInstanceProps, PreviewProps } from './typings'
import {
  SyncOutlined,
  // VerticalAlignBottomOutlined,
  CopyOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  EditOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import CodeEditor from '../CodeEditor'
import { CodeEditorInstanceProps } from '../CodeEditor/typings'
import { string2Component } from '../../utils/utils'
import './index.less'

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
  const [folded, setFolded] = useState(false)
  const [tsxCode, setTsxCode] = useState<string>('')
  const [scssCode, setScssCode] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('tsx')
  const [component, setComponent] = useState(<></>)
  const xmlEditor = useRef<CodeEditorInstanceProps>(null)
  const tsxEditor = useRef<CodeEditorInstanceProps>(null)
  const scssEditor = useRef<CodeEditorInstanceProps>(null)

  const parseXml = (newCode: string) => {
    string2Component(newCode)
      .then((newComponent) => {
        setComponent(newComponent)
      })
      .catch((info) => {
        message.error(info)
      })
  }

  const onTsxChangCode = useCallback((newCode) => {
    setTsxCode(newCode)
    refresh(newCode)
  }, [])

  const onScssChangCode = useCallback((newCode) => {
    setScssCode(newCode)
    refresh(newCode)
  }, [])

  const refresh = (code = tsxCode) => {
    const _xmlCode =
      code
        .substring(code.indexOf('return <Form'), code.indexOf('</Form>'))
        .replace('return', '') + '</Form>'
    string2Component(_xmlCode)
      .then((newComponent) => {
        setComponent(newComponent)
      })
      .catch((info) => {
        message.error(info)
      })
  }

  const copy = () => {}

  // const download = () => {};

  const close = () => {
    setActiveKey('tsx')
    setVisible(false)
    setFolded(false)
  }

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey)
  }

  useImperativeHandle(
    ref,
    () => ({
      xmlEditor: xmlEditor.current,
      tsEditor: tsxEditor.current,
      scssEditor: scssEditor.current,
      setXmlCode: (newCode: string) => {
        parseXml(newCode)
      },
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
    }),
    []
  )

  return (
    <Drawer
      width="100%"
      visible={visible}
      closable={false}
      destroyOnClose
      onClose={() => {
        setFolded(false)
        setVisible(false)
      }}
    >
      <div className="preview">
        <Tabs
          tabBarGutter={5}
          activeKey={activeKey}
          className={`code-container ${folded ? 'code-folded' : ''}`}
          onChange={onTabChange}
          tabBarStyle={{ height: '35px' }}
          type="card"
        >
          <TabPane
            tab={
              <div>
                {activeKey === 'tsx' ? <SelectedIcon /> : <UnSelectedIcon />}
                <span>tsx</span>
              </div>
            }
            key="tsx"
          >
            <CodeEditor
              ref={tsxEditor}
              code={tsxCode}
              options={{ language: 'typescript' }}
              onChangeCode={onTsxChangCode}
            />
          </TabPane>
          <TabPane
            tab={
              <div>
                {activeKey === 'scss' ? <SelectedIcon /> : <UnSelectedIcon />}
                <span>scss</span>
              </div>
            }
            key="scss"
          >
            <CodeEditor
              ref={scssEditor}
              code={scssCode}
              options={{ language: 'scss' }}
              onChangeCode={onScssChangCode}
            />
          </TabPane>
        </Tabs>
        <div className={`form ${folded ? 'form-open' : ''}`}>
          <div className="head">
            <Button
              icon={<SyncOutlined />}
              type="link"
              size="middle"
              onClick={() => refresh()}
            >
              刷新
            </Button>
            {/* <Button
              icon={<VerticalAlignBottomOutlined />}
              type="link"
              size="middle"
              onClick={download}
            >
              导出TSX文件
            </Button> */}
            <Button
              icon={<CopyOutlined />}
              type="link"
              size="middle"
              onClick={copy}
            >
              复制代码
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              type="link"
              size="middle"
              danger
              onClick={close}
            >
              关闭
            </Button>
          </div>
          <div className="body">{component}</div>
        </div>
        <Button
          shape="circle"
          className={`affix ${folded ? 'affix-folded' : ''}`}
          icon={folded ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => {
            setFolded(!folded)
          }}
        ></Button>
      </div>
    </Drawer>
  )
})
