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
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";

import useBackground from "../../../hooks/useBackground";
import { vendor } from "../../../assets/js/mockData";
import { VENDOR_STATUSES } from "../../../constants/app";

const { Header, Content } = Layout;

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
            <Row gutter={[24, 24]}>
              <Col span={4}>
                <Image
                  className="user-avatar"
                  src={vendor.profilePicUrl}
                  width="100%"
                  preview={false}
                />
              </Col>

              <Col span={13}>
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

                <br />

                <Space className="user-actions mt-3" size={12}>
                  <Button type="primary" size="large">
                    Contact
                  </Button>

                  <Button type="primary" size="large" ghost>
                    Contact
                  </Button>
                </Space>
              </Col>

              <Col span={3}>
                <Space direction="vertical" size={12}>
                  <strong>Availability</strong>

                  <strong>Phone</strong>

                  <strong>Email</strong>

                  <strong>Years of Experience</strong>
                </Space>
              </Col>

              <Col span={4}>
                <Space direction="vertical" size={12}>
                  <Space>
                    <Icon className="font-18" />
                    <span>{vendor.status}</span>
                  </Space>

                  <div>{vendor.phone}</div>

                  <a className="d-block" href={`mailto:${vendor.email}`}>
                    {vendor.email}
                  </a>

                  <div>{vendor.experience}</div>
                </Space>
              </Col>
            </Row>
          </Card>
        </ConfigProvider>
      </Header>

      <Content className="vendors-list-content container">
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          <Tabs size="large">
            <Tabs.TabPane key="services" tab="Services"></Tabs.TabPane>
            <Tabs.TabPane key="events" tab="Events"></Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}
