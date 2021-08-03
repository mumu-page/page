import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Button, Form, Input, Modal, Radio, Select } from 'antd'
import Draggable from 'react-draggable'
import DragableTable, { Option } from './DragableTable'
// import CodeEditor from '../../../../components/CodeEditor'
// import { CodeEditorInstanceProps } from '../../../../components/CodeEditor/typings'
import { cloneDeep } from 'lodash'
import './index.less'

// TODO 改用JSON树，可编辑
export interface IRefType {
  showModal: () => void
  hideModal: () => void
  setdataSource: (dataSource: any) => void
}

function getFunction(reqUrl: any, reqMethod: any) {
  return `
/**
 * 请不要修改方法体以外的内容
 */
function getData(){
    return fetch('${reqUrl}', {method: ${reqMethod}}).then(res => {
    return res.json()
}).then(res => {
    return res
    // TODO 自定义返回数据
})}`
}

const initialValues = {
  reqUrl: '/react-visual-editor/options.mock.json',
  reqMethod: 'GET',
}

const _treeData: Option[] = [
  {
    key: 'key1',
    label: '选项1',
    value: '值1',
  },
  {
    label: '分组1',
    children: [
      {
        key: 'key3',
        label: '分组下的选项2',
        value: '值2',
      },
    ],
    key: 'key2',
    value: 'key2',
  },
]
export default forwardRef(
  (
    props: any,
    ref: ((instance: IRefType) => void) | React.MutableRefObject<unknown> | null
  ) => {
    const { onOk } = props
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [fnCode] = useState(
      getFunction(initialValues.reqUrl, initialValues.reqMethod)
    )
    const [isRequest, setIsRequest] = useState(false)
    const [mode, setMode] = useState<'可视化配置' | '代码配置'>('可视化配置')
    const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    })
    const [dataSource, setdataSource] = useState<Option[]>(_treeData)
    const draggleRef = useRef(null)
    const [form] = Form.useForm()
    // const fnEditor = useRef<CodeEditorInstanceProps>(null)

    const showModal = () => {
      setIsModalVisible(true)
    }

    const hideModal = () => {
      setIsModalVisible(false)
    }

    const handleOk = () => {
      setIsModalVisible(false)
      if (isRequest) {
        if (typeof onOk === 'function') {
          onOk([])
        }
      } else {
        if (typeof onOk === 'function') {
          onOk(cloneDeep(dataSource))
        }
      }
    }

    const onStart = (event: any, uiData: { x: number; y: number }) => {
      const { clientWidth, clientHeight } = window?.document?.documentElement
      const { left, right, top, bottom } =
        (draggleRef?.current as any as HTMLElement)?.getBoundingClientRect() ||
        {}
      setBounds({
        left: -left + uiData?.x,
        right: clientWidth - (right - uiData?.x),
        top: -top + uiData?.y,
        bottom: clientHeight - (bottom - uiData?.y),
      })
    }

    const onValuesChange = (_: any, allValues: any) => {
      const { reqUrl, reqMethod } = allValues
      //   fnEditor.current?.setCode(getFunction(reqUrl, reqMethod))
    }

    useImperativeHandle(
      ref,
      () => ({
        showModal,
        hideModal,
        setdataSource,
      }),
      []
    )

    return (
      <Modal
        title={
          <div
            style={{
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: 34,
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false)
              }
            }}
            onMouseOut={() => {
              setDisabled(true)
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            <span>
              配置数据
              <Button
                type="link"
                onClick={() => {
                  setIsRequest(!isRequest)
                }}
              >
                {isRequest ? '切换固定配置' : '切换动态配置'}
              </Button>
            </span>
            {!isRequest && (
              <Radio.Group
                size="small"
                style={{
                  lineHeight: 0,
                }}
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value)
                }}
              >
                <Radio.Button value="可视化配置">可视化配置</Radio.Button>
                <Radio.Button value="代码配置">代码配置</Radio.Button>
              </Radio.Group>
            )}
          </div>
        }
        onCancel={hideModal}
        visible={isModalVisible}
        okText="确定"
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event: any, uiData: any) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={
          <Button type="primary" size="middle" onClick={handleOk}>
            确定
          </Button>
        }
      >
        {isRequest && (
          <>
            <Form
              form={form}
              onValuesChange={onValuesChange}
              initialValues={initialValues}
            >
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 19 }}
                label="请求地址"
                name="reqUrl"
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 19 }}
                label="请求方法"
                name="reqMethod"
              >
                <Select>
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="GET">GET</Select.Option>
                </Select>
              </Form.Item>
            </Form>
            {/* <CodeEditor
              options={{ width: '100%', height: 300, language: 'javascript' }}
              ref={fnEditor}
              code={fnCode}
            /> */}
          </>
        )}
        {
          !isRequest &&
            (mode === '可视化配置' ? (
              <div
                style={{ display: mode === '可视化配置' ? 'block' : 'none' }}
                onMouseEnter={() => {
                  setDisabled(true)
                }}
              >
                <DragableTable
                  dataSource={dataSource}
                  onChange={(val) => {
                    setdataSource(val)
                  }}
                />
              </div>
            ) : null)
          // <CodeEditor
          //   options={{ width: '100%', height: 300, language: 'json' }}
          //   code={JSON.stringify(dataSource)}
          //   onChange={(val) => {
          //     if (val) {
          //       try {
          //         setdataSource(JSON.parse(val))
          //       } catch (e) {
          //         console.log(e)
          //       }
          //     }
          //   }}
          // />
        }
      </Modal>
    )
  }
)
