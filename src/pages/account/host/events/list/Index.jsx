import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import { Content } from "antd/es/layout/layout";
import { ConfigProvider, Input } from "antd";

export default function EventsList() {
  return (
    <Content className="host-events-layout">
      <h4>Events</h4>

      <ConfigProvider theme={{ token: { borderRadius: 20 } }}>
        <Input size="large" prefix={<SearchOutlined />} bordered />
      </ConfigProvider>
    </Content>
  );
}
