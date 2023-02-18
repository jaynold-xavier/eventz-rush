import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Image,
  Layout,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";

import useBackground from "../../../hooks/useBackground";
import { vendor } from "../../../assets/js/mockData";
import { VENDOR_STATUSES } from "../../../constants/app";
import StatusIcon from "../list/templates/StatusIcon";

const { Header, Content } = Layout;

const avatarProps = {
  shape: "circle",
  size: { xs: 100, sm: 130, md: 120, lg: 120, xl: 150, xxl: 150 },
};

export default function VendorDetails() {
  const { id } = useParams();

  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  const Icon = VENDOR_STATUSES.available.icon;

  return (
    <Layout className="vendor-details-layout">
      <Header prefixCls="vendor-general-info" className="container">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ed7802",
            },
          }}
        >
          <Card bordered={false}>
            <Row align="middle" gutter={[24, 24]}>
              <Col xs={3} sm={3} lg={3} md={3} xl={3} xxl={3}>
                <Skeleton
                  avatar={avatarProps}
                  title={false}
                  paragraph={false}
                  loading={false}
                  active
                >
                  <div className="d-inline-block position-relative">
                    <Avatar
                      className="user-avatar"
                      src={vendor.profilePicUrl}
                      {...avatarProps}
                    />

                    <StatusIcon
                      status="Available"
                      style={{ top: 5, right: 10 }}
                    />
                  </div>
                </Skeleton>
              </Col>

              <Col xs={8} sm={8} lg={8} md={8} xl={8} xxl={8}>
                <Typography.Title
                  className="user-name mb-0"
                  level={2}
                  ellipsis={{ tooltip: vendor.title }}
                >
                  {vendor.title}
                </Typography.Title>

                <Tag
                  className="text-uppercase font-12 mr-0 mt-1"
                  color="geekblue"
                >
                  {vendor.type}
                </Tag>
              </Col>

              <Col span={9}>
                <Row>
                  <Col span={12}>
                    <Space direction="vertical" size={12}>
                      <strong>Phone</strong>

                      <strong>Email</strong>

                      <strong>Years of Experience</strong>
                    </Space>
                  </Col>

                  <Col span={12}>
                    <Space direction="vertical" size={12}>
                      <div>{vendor.phone}</div>

                      <a className="d-block" href={`mailto:${vendor.email}`}>
                        {vendor.email}
                      </a>

                      <div>{vendor.experience}</div>
                    </Space>
                  </Col>
                </Row>
              </Col>

              <Col className="d-flex" span={4}>
                <Space
                  direction="vertical"
                  className="user-actions ml-auto"
                  size={12}
                >
                  <Button type="primary" size="large">
                    Contact
                  </Button>

                  <Button type="primary" size="large" ghost>
                    Contact
                  </Button>
                </Space>
              </Col>

              <Col span={24}>
                <strong>About</strong>
                <div dangerouslySetInnerHTML={{ __html: vendor.description }} />
              </Col>
            </Row>
          </Card>
        </ConfigProvider>
      </Header>

      <Content className="vendor-details-content">
        <Tabs className="tabs-container" size="large">
          <Tabs.TabPane key="services" tab="Services"></Tabs.TabPane>
          <Tabs.TabPane key="photos" tab="Photos"></Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
