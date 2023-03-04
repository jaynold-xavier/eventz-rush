import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Content } from "antd/es/layout/layout";
import { Alert, Button, Col, ConfigProvider, Row } from "antd";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";

export default function HostDashboard({ user }) {
  const [firstName] = getDisplayName(user).split(" ");

  return (
    <Content className="host-dashboard-layout">
      <h4>Dashboard</h4>

      <br />
      <br />

      <ConfigProvider
        theme={{
          token: {
            colorText: "#fc7985",
            colorInfo: "#ff4455",
          },
        }}
      >
        <Alert
          className="mb-5"
          message={<h5 className="mb-3">Welcome {firstName}!</h5>}
          closable
        />
      </ConfigProvider>

      <Row>
        <Col span={6}>
          <ScrollableCard>Upcoming Events</ScrollableCard>
        </Col>
      </Row>

      <br />
      <br />

      <div className="text-center">
        <Button
          className="create-event-bg"
          type="primary"
          size="large"
          icon={<PlusOutlined />}
        >
          Create Event
        </Button>
      </div>
    </Content>
  );
}
