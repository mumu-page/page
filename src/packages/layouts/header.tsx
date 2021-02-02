import React, { useContext, useEffect, useRef } from "react";
import { Button, Modal } from "antd";
import {
  PlayCircleOutlined,
  EyeOutlined,
  VerticalAlignBottomOutlined,
  CopyOutlined,
  DeleteOutlined,
  LayoutTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Context } from "../stores/context";
import {
  SET_COMPONENT_LIST,
} from "../stores/action-type";
import { Preview } from '../components';
import { PreviewProp } from '../components/Preview/typings';

export default function () {
  const { commonDispatch } = useContext(Context);
  const preview = useRef<PreviewProp>(null)

  const clean = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "确定要清空所有组件吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        commonDispatch({ type: SET_COMPONENT_LIST, payload: [] });
      },
    });
  };

  const run = () => {
    preview.current?.open()
  }

  useEffect(() => {
  }, [])

  return (
    <>
      <div className="title">
        <LayoutTwoTone />
        <span style={{ marginLeft: "10px" }}>Form Generator</span>
      </div>
      <div className="actions">
        <Button
          icon={<PlayCircleOutlined />}
          type="link"
          size="large"
          onClick={run}
        >
          运行
        </Button>
        <Button icon={<EyeOutlined />} type="link" size="large">
          查看JSON
        </Button>
        <Button icon={<VerticalAlignBottomOutlined />} type="link" size="large">
          导出TSX文件
        </Button>
        <Button icon={<CopyOutlined />} type="link" size="large">
          复制代码
        </Button>
        <Button
          icon={<DeleteOutlined />}
          type="link"
          danger
          size="large"
          onClick={clean}
        >
          清空
        </Button>
      </div>
      {/* <CodeEditor /> */}
      <Preview ref={preview} />
    </>
  );
}
