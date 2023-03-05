import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import {
  Alert,
  Button,
  Calendar,
  Col,
  ConfigProvider,
  Layout,
  Row,
} from "antd";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";

import BlobImg1 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg2 from "../../../../assets/images/shapes/shape-3.svg";

const { Header, Content } = Layout;

export default function Dashboard({ user }) {
  const [firstName] = getDisplayName(user).split(" ");

  return (
    <Layout prefixCls="host-dashboard-layout">
      <Header prefixCls="host-dashboard-header">
        <h5>Dashboard</h5>
      </Header>

      <Content>
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

        <Row gutter={[24, 24]}>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <ScrollableCard blobImg={BlobImg2}>Upcoming Events</ScrollableCard>
          </Col>

          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <ScrollableCard blobImg={BlobImg1}>
              Processing Events
            </ScrollableCard>
          </Col>
        </Row>

        <br />
        <br />

        <div className="text-center">
          <Button
            className="create-event-btn"
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            ghost
          >
            Create Event
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <Calendar
              headerRender={() => (
                <Header prefixCls="p-3">
                  <h5>Events</h5>
                </Header>
              )}
              fullscreen={false}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
