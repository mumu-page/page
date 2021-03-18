import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button, Divider, Modal, Radio, Space, Typography } from "antd";
import Draggable from "react-draggable";
import { cloneDeep, uniqueId } from "lodash";
import DragableTable, { find, Option } from "./DragableTable";
import "./index.scss";
import { CodeEditor } from "..";

export interface IRefType {
  showModal: () => void;
  hideModal: () => void;
  setdataSource: (dataSource: any) => void;
}

const _treeData: Option[] = [
  {
    key: "key1",
    label: "选项1",
    value: "值1",
  },
  {
    label: "分组1",
    children: [
      {
        key: "key3",
        label: "分组下的选项2",
        value: "值2",
      },
    ],
    key: "key2",
    value: "key2",
  },
];

let selectedKeys: number | string = "";
export default forwardRef(
  (
    props: any,
    ref: ((instance: IRefType) => void) | React.MutableRefObject<unknown> | null
  ) => {
    const { onOk } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [mode, setMode] = useState<"可视化配置" | "代码配置">("可视化配置");
    const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    });
    const [dataSource, setdataSource] = useState<Option[]>(_treeData);
    const draggleRef = useRef(null);

    const showModal = () => {
      setIsModalVisible(true);
    };

    const hideModal = () => {
      setIsModalVisible(false);
    };

    const handleOk = () => {
      setIsModalVisible(false);
      if (typeof onOk === "function") {
        onOk(dataSource);
      }
    };

    const onStart = (event: any, uiData: { x: number; y: number }) => {
      const { clientWidth, clientHeight } = window?.document?.documentElement;
      const { left, right, top, bottom } =
        ((draggleRef?.current as any) as HTMLElement)?.getBoundingClientRect() ||
        {};
      setBounds({
        left: -left + uiData?.x,
        right: clientWidth - (right - uiData?.x),
        top: -top + uiData?.y,
        bottom: clientHeight - (bottom - uiData?.y),
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        showModal,
        hideModal,
        setdataSource,
      }),
      []
    );

    return (
      <Modal
        title={
          <div
            style={{
              cursor: "move",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 34,
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            <span>配置数据</span>
            <Radio.Group
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
              }}
            >
              <Radio.Button value="可视化配置">可视化配置</Radio.Button>
              <Radio.Button value="代码配置">代码配置</Radio.Button>
            </Radio.Group>
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
        {mode === "可视化配置" ? (
          <div
            style={{ display: mode === "可视化配置" ? "block" : "none" }}
            onMouseEnter={() => {
              setDisabled(true);
            }}
          >
            <DragableTable
              dataSource={dataSource}
              onChange={(val, _selectedKeys) => {
                setdataSource(val);
                selectedKeys = _selectedKeys?.[0];
              }}
            />
            <Space
              style={{
                marginTop: 10,
              }}
              split={<Divider type="vertical" />}
            >
              <Typography.Link
                onClick={() => {
                  if (!selectedKeys) {
                    setdataSource((state) => {
                      state.push({
                        label: "12141",
                        value: uniqueId(),
                        key: uniqueId(),
                      });
                      return cloneDeep(state);
                    });
                    return;
                  }
                  const newData = find(
                    selectedKeys,
                    cloneDeep(dataSource),
                    (item, i, target) => {
                      (item.children || (item.children = [])).push({
                        label: "12141",
                        value: uniqueId(),
                        key: uniqueId(),
                      });
                    }
                  );
                  setdataSource(newData);
                }}
              >
                添加一项
              </Typography.Link>
              {/* <Typography.Link onClick={() => {}}>添加分组</Typography.Link> */}
            </Space>
          </div>
        ) : (
          <CodeEditor
            options={{ language: "json" }}
            style={{
              width: "100%",
              height: 300,
            }}
              code={JSON.stringify(dataSource)}
              onChangeCode={(val) => {
                val && setdataSource(JSON.parse(val));
              }}
          />
        )}
      </Modal>
    );
  }
);
