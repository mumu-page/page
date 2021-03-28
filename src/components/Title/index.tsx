import { Typography, Row, Col } from "antd";
import React from "react";

/**
 * 支持设置右侧扩展区域
 */
export default (props: any) => {
  const { text, extra } = props;
  return (
    <Row justify="space-between" style={{ padding: '0 10px' }}>
      <Col>
        <Typography.Title level={5}>
          <Typography.Text type="secondary">
            {text}
          </Typography.Text>
        </Typography.Title>
      </Col>
      <Col>{extra}</Col>
    </Row>
  );
};
