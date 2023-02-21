import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Layout,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { find } from "lodash";

import useBackground from "../../../hooks/useBackground";
import { vendors } from "../../../assets/js/mockData";
import Services from "./services/Index";
import Photos from "./photos/Index";
import { navLinkTheme } from "../../../assets/js/theme";

const { Header, Content } = Layout;

const avatarProps = {
  shape: "circle",
  size: { xs: 100, sm: 130, md: 120, lg: 120, xl: 150, xxl: 150 },
};

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  const vendor = find(vendors, (v) => v.id === id) || vendors[0];

  return (
    <Layout className="vendor-details-layout">
      <Header prefixCls="vendor-general-info" className="container">
        <ConfigProvider
          theme={{
            token: {
              colorLink: "#fff",
              ...navLinkTheme,
            },
          }}
        >
          <Button
            className="p-0"
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={(e) => navigate(-1)}
          >
            Back
          </Button>
        </ConfigProvider>

        <br />
        <br />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ed7802",
            },
          }}
        >
          <Card bordered={false}>
            <Row align="middle" gutter={[24, 24]}>
              <Col xs={24} sm={6} lg={4} md={4} xl={3} xxl={3}>
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
                  </div>
                </Skeleton>
              </Col>

              <Col xs={24} sm={18} lg={20} md={20} xl={8} xxl={8}>
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

              <Col xs={24} sm={15} lg={15} md={15} xl={9} xxl={9}>
                <Row>
                  <Col span={12}>
                    <Space direction="vertical" size={12}>
                      <strong>Phone</strong>

                      <strong>Email</strong>

                      <strong>Years of Experience</strong>

                      <strong>Website</strong>
                    </Space>
                  </Col>

                  <Col span={12}>
                    <Space direction="vertical" size={12}>
                      <div>{vendor.phone}</div>

                      <a className="d-block" href={`mailto:${vendor.email}`}>
                        {vendor.email}
                      </a>

                      <div>{vendor.experience}</div>

                      <div>{vendor.website}</div>
                    </Space>
                  </Col>
                </Row>
              </Col>

              <Col
                className="d-flex"
                xs={24}
                sm={9}
                lg={9}
                md={9}
                xl={3}
                xxl={3}
              >
                <Space
                  direction="vertical"
                  className="user-actions w-100"
                  size={12}
                >
                  <Button type="primary" size="large" block>
                    Contact
                  </Button>

                  <Button type="primary" size="large" ghost block>
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

      <br />
      <br />
      <br />

      <Content className="vendor-details-content">
        <Tabs className="tabs-container" size="large">
          <Tabs.TabPane key="services" tab="Services">
            <Services />
          </Tabs.TabPane>

          <Tabs.TabPane key="photos" tab="Photos">
            <Photos />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
