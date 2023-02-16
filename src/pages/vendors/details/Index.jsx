import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  Image,
  Layout,
  Row,
  Tabs,
  Typography,
} from "antd";

import useBackground from "../../../hooks/useBackground";
import { vendor } from "../../../assets/js/mockData";

const { Header, Content } = Layout;

export default function VendorDetails() {
  const { id } = useParams();

  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  return (
    <Layout className="vendor-details-layout">
      <Header prefixCls="vendor-general-info">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "orange",
              colorLink: "#38e5ff",
              colorLinkHover: "#1effd5",
              colorTextHeading: "#fff",
              colorText: "#fff",
            },
          }}
        >
          <Row className="container" gutter={[24, 24]}>
            <Col span={6}>
              <Image src={vendor.profilePicUrl} width="100%" />
              <Button className="mt-1" type="primary" block>
                Contact
              </Button>
            </Col>

            <Col span={10}>
              <Typography.Title ellipsis>{vendor.title}</Typography.Title>
            </Col>

            <Col span={8}>
              <div>Phone</div>
              <div>{vendor.phone}</div>

              <br />

              <div>Email</div>
              <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
            </Col>

            <Col span={24}>
              <div>About</div>
              <Typography.Paragraph ellipsis>
                <div dangerouslySetInnerHTML={{ __html: vendor.description }} />
              </Typography.Paragraph>
            </Col>
          </Row>
        </ConfigProvider>
      </Header>

      <Content className="vendors-list-content">
        <div className="container">
          <Tabs size="large">
            <Tabs.TabPane key="details" tab="Details"></Tabs.TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
}
