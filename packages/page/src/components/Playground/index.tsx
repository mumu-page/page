import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react'
import { Tabs, Drawer, Button, Space, Divider } from 'antd'
import { PreviewInstanceProps, PreviewProps } from './typings'
import {
  FileTextOutlined,
  EditOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import Compile from '../../utils/compile'
import SplitPane /* , { Pane } */ from 'react-split-pane'
import { genrateList1 } from '../../utils/genrateList1'
import { Generate, Store } from '@r-generator/core'
import Editor, { OnMount } from '@monaco-editor/react'
import './index.less'

function compatibleTsx(monaco: any) {
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

  const importHelper = [
    {
      name: 'react',
      url: 'https://cdn.jsdelivr.net/npm/@types/react@17.0.2/index.d.ts',
    },
    {
      name: 'antd',
      url: 'https://cdn.jsdelivr.net/npm/antd@4.14.0/lib/index.d.ts',
    },
    {
      name: '@ant-design/icons',
      url: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@4.6.2/lib/index.d.ts',
    },
  ]

  Promise.all(
    importHelper.map(({ url }) => {
      return fetch(url).then((res) => res.text())
    })
  ).then((values) => {
    importHelper.forEach(({ name }, i) => {
      const fixedPackageName = name.startsWith('@')
        ? name.slice(1).replace('/', '__')
        : name
      console.log(fixedPackageName)
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        values[i],
        `file:///node_modules/@types/${fixedPackageName}/index.d.ts`
      )
    })
  })
}

const { useStore } = Store.Hooks
const { TabPane } = Tabs
const SelectedIcon = () => (
  <EditOutlined style={{ color: '#f1fa8c', marginRight: '5px' }} />
)
const UnSelectedIcon = () => (
  <FileTextOutlined style={{ color: '#a95812', marginRight: '5px' }} />
)
const defaultFileName = 'index.tsx'
export default forwardRef<PreviewInstanceProps, PreviewProps>(function (
  _props,
  ref
) {
  const [IndexCode, setIndexCode] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [fileName, setFileName] = useState(defaultFileName)
  const [component, setComponent] = useState(<></>)
  const [width, setWidth] = useState<number | string>('')
  const { componentList, target } = useStore()
  // 依赖组件列表数据，根据它生成tab
  const list = componentList?.filter?.((item) => item.componentKey === 'List1')
  const files = {
    'index.tsx': {
      name: 'index.tsx',
      language: 'typescript',
      value: IndexCode,
    },
  } as any
  list?.forEach((item) => {
    const flag = `List1${String(item.id).slice(0, 4)}.tsx`
    files[flag] = {
      name: flag,
      language: 'typescript',
      value: genrateList1(item?.componentProps?.fields),
    }
  })
  const file = files[fileName] || {}

  const onRun = (code?: string) => {
    const genrate = new Generate.Generate(componentList, target)
    if (code) {
      setIndexCode(code)
    } else {
      setIndexCode(genrate.generate())
    }
    new Compile(genrate).string2Component(list, code).then((newComponent) => {
      if (typeof newComponent === 'function') {
        const Component = newComponent()
        setComponent(<Component />)
      }
    })
  }

  const onDragFinished = (newSize: number) => {
    setWidth(newSize)
  }

  const onTabChange = (activeKey: string) => {
    setFileName(activeKey)
  }

  const onClose = () => {
    setVisible(false)
    setFileName(defaultFileName)
  }

  const onMount: OnMount = (_editor, monaco) => {
    compatibleTsx(monaco)
    Object.keys(files).forEach((key) => {
      const item = files[key]
      if (
        key === 'index.tsx' ||
        // 不创建已有的model
        monaco.editor.getModel(monaco.Uri.parse(item.name))
      ) {
        return
      }
      monaco.editor.createModel(
        item.value,
        item.language,
        monaco.Uri.parse(item.name)
      )
    })
    setTimeout(() => {
      _editor?.getAction('editor.action.formatDocument')?.run()
    }, 300)
  }

  useImperativeHandle(
    ref,
    () => ({
      setIndexCode,
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
          <div className="code-container">
            <Tabs
              tabBarGutter={5}
              activeKey={fileName}
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
              {Object.keys(files).map((key) => {
                const item = files[key]
                return (
                  <TabPane
                    tab={
                      <div>
                        {fileName === item.name ? (
                          <SelectedIcon />
                        ) : (
                          <UnSelectedIcon />
                        )}
                        <span>{item.name}</span>
                      </div>
                    }
                    key={item.name}
                  />
                )
              })}
            </Tabs>
            <Editor
              height="calc(100vh - 35px)"
              theme="vs-dark"
              path={file.name}
              language={file.language}
              value={file.value}
              onMount={onMount}
            />
          </div>
          <div className="form">
            <div className="body">{component}</div>
          </div>
        </SplitPane>
      </div>
    </Drawer>
  )
})
