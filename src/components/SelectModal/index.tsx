import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Modal, Radio, Table } from "antd";
import Draggable from "react-draggable";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import "./index.scss";
import { cloneDeep, uniqueId } from "lodash";

const DragHandle = SortableHandle(() => <div className="drag-handle-icon" />);

const SortableItem = SortableElement(
  (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLTableRowElement> &
      React.HTMLAttributes<HTMLTableRowElement>
  ) => <tr {...props} />
);

const SortableContainer2 = SortableContainer(
  (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLTableSectionElement> &
      React.HTMLAttributes<HTMLTableSectionElement>
  ) => <tbody {...props} />
);

const data = [
  {
    label: "John Brown",
    value: uniqueId(),
    index: uniqueId(),
  },
  {
    label: "Jim Green",
    value: uniqueId(),
    index: uniqueId(),
  },
  {
    label: "Joe Black",
    value: uniqueId(),
    index: uniqueId(),
  },
];

export interface IRefType {
  showModal: () => void;
  hideModal: () => void;
  setdataSource: (dataSource: any) => void;
}

export default forwardRef(
  (
    props: any,
    ref: ((instance: IRefType) => void) | React.MutableRefObject<unknown> | null
  ) => {
    const { onOk } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    });
    const [dataSource, setdataSource] = useState(data);
    const draggleRef = useRef(null);

    const columns = [
      {
        title: "选项内容",
        className: "drag-handle",
        dataIndex: "label",
        width: 200,
        render: (text: any) => (
          <>
            <DragHandle />
            {text}
          </>
        ),
      },
      {
        title: "选项值",
        width: 200,
        dataIndex: "value",
      },
      {
        title: "操作",
        width: 50,
        dataIndex: "action",
        render(_: any, text: any, index: number) {
          return (
            <>
              <a
                onClick={() => {
                  setdataSource((state) => {
                    const _state = cloneDeep(state);
                    _state.splice(index, 1);
                    return _state;
                  });
                }}
              >
                删除
              </a>
            </>
          );
        },
      },
    ];

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

    const onSortEnd = ({ oldIndex, newIndex }: any) => {
      if (oldIndex !== newIndex) {
        const newData = arrayMove(
          [].concat(dataSource as any),
          oldIndex,
          newIndex
        ).filter((el) => !!el);
        setdataSource(newData);
      }
    };

    const DraggableContainer = (props: any) => (
      <SortableContainer2
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        lockAxis="y"
        {...props}
      />
    );

    const DraggableBodyRow = (
      { className, style, ...restProps }: any,
      collection: string | number | undefined
    ) => {
      const dataRowKey = restProps["data-row-key"];
      // function findIndex base on Table rowKey props and should always be a right array index
      const index = dataSource.findIndex((x) => x.index === dataRowKey);
      return (
        <SortableItem
          index={index}
          {...restProps}
          collection={collection}
          onMouseOut={() => setDisabled(true)}
        />
      );
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
              paddingRight: 20,
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
            <Radio.Group>
              <Radio.Button value="可视化配置">可视化配置</Radio.Button>
              <Radio.Button value="代码配置">代码配置</Radio.Button>
            </Radio.Group>
          </div>
        }
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
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="index"
          size="small"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
        <Button
          style={{
            marginTop: 10,
          }}
          type="link"
          onClick={() => {
            setdataSource((state) => {
              const _state = cloneDeep(state);
              _state.push({
                label: "12141",
                value: uniqueId(),
                index: uniqueId(),
              });
              return _state;
            });
          }}
        >
          添加一项
        </Button>
      </Modal>
    );
  }
);
