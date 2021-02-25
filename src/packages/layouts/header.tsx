import React, { useContext, useEffect, useRef } from "react";
import { Button, Modal /* message */ } from "antd";
import {
  PlayCircleOutlined,
  // EyeOutlined,
  // VerticalAlignBottomOutlined,
  // CopyOutlined,
  DeleteOutlined,
  LayoutTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Context } from "../stores/context";
import { DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG } from "../stores/action-type";
import { Preview } from "../components";
import { PreviewInstanceProps } from "../components/Preview/typings";
import { generate, generateImport } from "../utils/genrate";

export default function () {
  const { componentList, commonDispatch } = useContext(Context);
  const preview = useRef<PreviewInstanceProps>(null);

  const clean = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "确定要清空所有组件吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        commonDispatch({ type: DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG });
      },
    });
  };

  const run = () => {
    const xmlCode = generate(componentList);
    preview.current?.setXmlCode(xmlCode);
    preview.current?.setTsxCode(`
      ${generateImport(componentList)}
      export default () => {
        /* 主要代码开始 */
        return ${xmlCode}
        /* 主要代码结束 */
      }
    `);
    preview.current?.open();
  };

  // const handlePreview = () => {
  //   message.info("敬请期待");
  // };

  // const download = () => {};

  // const copy = () => {};

  useEffect(() => {}, []);

  return (
    <>
      <div className="title">
        <LayoutTwoTone />
        <span style={{ marginLeft: "5px" }}>
          Form Generator
          <a
            href="https://gitee.com/resonances/react-visual-editor"
            style={{ marginLeft: "20px" }}
          >
            <img
              width={20}
              src="https://gitee.com/resonances/react-visual-editor/widgets/widget_5.svg?color=00aeff"
              alt="Fork me on Gitee"
            ></img>
          </a>
        </span>
      </div>
      <div className="actions">
        <Button
          icon={<PlayCircleOutlined />}
          type="link"
          size="middle"
          onClick={run}
        >
          运行
        </Button>
        {/* <Button
          icon={<EyeOutlined />}
          type="link"
          size="middle"
          onClick={handlePreview}
        >
          查看JSON
        </Button>
        <Button
          icon={<VerticalAlignBottomOutlined />}
          type="link"
          size="middle"
          onClick={download}
        >
          导出TSX文件
        </Button> */}
        {/*  <Button
          icon={<CopyOutlined />}
          type="link"
          size="middle"
          onClick={copy}
        >
          复制代码
        </Button> */}
        <Button
          icon={<DeleteOutlined />}
          type="link"
          danger
          size="middle"
          onClick={clean}
        >
          清空
        </Button>
      </div>
      <Preview ref={preview} />
    </>
  );
}
