import React from 'react';
import { Button } from "antd";
import { PlayCircleOutlined, EyeOutlined, VerticalAlignBottomOutlined, CopyOutlined, DeleteOutlined, LayoutTwoTone } from "@ant-design/icons";

export default function () {
  return (
    <>
      <div className='title'>
        <LayoutTwoTone /><span style={{marginLeft: '10px'}}>Form Generator</span>
      </div>
      <div className='actions'>
        <Button icon={<PlayCircleOutlined />} type="link" size='large'>运行</Button>
        <Button icon={<EyeOutlined />} type="link" size='large'>查看json</Button>
        <Button icon={<VerticalAlignBottomOutlined />} type="link" size='large'>导出tsx文件</Button>
        <Button icon={<CopyOutlined />} type="link" size='large'>复制代码</Button>
        <Button icon={<DeleteOutlined />} type="link" danger size='large'>清空</Button>
      </div>
    </>
  );
}
