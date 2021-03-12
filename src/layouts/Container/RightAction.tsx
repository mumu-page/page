import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PicCenterOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { BtnTypes } from ".";
import { Preview, PreviewInstanceProps } from "../../components";
import { SCROLL_CENTER, SHOW_SETTING_PANL } from "../../constants/events";
import {
  DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG,
  SET_MOVEABLE_OPTIONS,
} from "../../stores/action-type";
import { Context } from "../../stores/context";
import eventBus from "../../utils/eventBus";
import { generate, generateImport } from "../../utils/genrate";

interface RightActionType {
  handleType: (val: BtnTypes) => void;
  type: BtnTypes;
}
export default (props: RightActionType) => {
  const { type, handleType } = props;
  const preview = useRef<PreviewInstanceProps>(null);
  const { componentList, commonDispatch } = useContext(Context);

  const handleColor = (val: BtnTypes) => {
    return {
      color: type !== val ? "#fff" : "",
      fontSize: 18,
    };
  };

  const clean = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "确定要清空所有组件吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        commonDispatch({ type: DELETE_ALL_COMPONENT_LIST_AND_CURRENT_DRAG });
        commonDispatch({
          type: SET_MOVEABLE_OPTIONS,
          payload: {
            target: null,
          },
        });
      },
    });
  };

  const run = () => {
    const xmlCode = generate(componentList);
    preview.current?.setXmlCode(xmlCode);
    preview.current?.setTsxCode(`
      ${generateImport(componentList)}
      export default () => {
       return ${xmlCode}
      }
    `);
    preview.current?.open();
  };

  const handlePreview = () => {
    message.info("敬请期待");
  };

  const download = () => {};

  const center = () => {
    eventBus.emit(SCROLL_CENTER);
  };

  const handelShowSettingPanl = useCallback(() => {
    handleType("setting");
  }, []);

  useEffect(() => {
    eventBus.addListener(SHOW_SETTING_PANL, handelShowSettingPanl);
    return () => {
      eventBus.removeListener(SHOW_SETTING_PANL, handelShowSettingPanl);
    };
  }, []);

  return (
    <>
      <Button
        icon={<PlayCircleOutlined style={handleColor("run")} />}
        type={type === "run" ? "primary" : "text"}
        onClick={() => {
          handleType("run");
          run();
        }}
      />
      <Button
        icon={<PicCenterOutlined style={handleColor("center")} />}
        type={type === "center" ? "primary" : "text"}
        onClick={() => {
          center();
        }}
      />
      <Button
        icon={<EyeOutlined style={handleColor("preview")} />}
        type={type === "preview" ? "primary" : "text"}
        size="middle"
        onClick={() => {
          handleType("preview");
          handlePreview();
        }}
      />
      <Button
        icon={<VerticalAlignBottomOutlined style={handleColor("download")} />}
        type={type === "download" ? "primary" : "text"}
        size="middle"
        onClick={() => {
          handleType("download");
          download();
        }}
      />
      <Button
        icon={<DeleteOutlined style={handleColor("clean")} />}
        type={type === "clean" ? "primary" : "text"}
        danger
        onClick={() => {
          handleType("clean");
          clean();
        }}
      />
      <Button
        icon={<SettingOutlined style={handleColor("setting")} />}
        type={type === "setting" ? "primary" : "text"}
        onClick={() => handleType("setting")}
      />
      <Preview ref={preview} />
    </>
  );
};
