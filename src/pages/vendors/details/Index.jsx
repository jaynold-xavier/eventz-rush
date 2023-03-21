import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Col,
  Layout,
  Row,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from "antd";

import { getUser } from "../../../services/database";
import useBackground from "../../../hooks/useBackground";
import Services from "./services/Index";
import Photos from "./photos/Index";
import { get } from "lodash";

const { Header, Content } = Layout;

const avatarProps = {
  shape: "circle",
  size: { xs: 100, sm: 130, md: 120, lg: 120, xl: 150, xxl: 150 },
};

export default function VendorDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  useEffect(() => {
    let isCancel = false;

    fetchVendor(isCancel);

    async function fetchVendor(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const vendor = await getUser(id);
        setData(vendor);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [id]);

  const showContactInfo =
    get(data, "config.showContactInfo") && get(data, "phoneNumber");

  return (
    <Spin spinning={loading}>
      <Layout className="vendor-details-layout rounded container mt-5 mb-5">
        <Header prefixCls="vendor-general-info">
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
                    src={data.photoURL}
                    {...avatarProps}
                  />
                </div>
              </Skeleton>
            </Col>

            <Col xs={24} sm={18} lg={20} md={20} xl={8} xxl={8}>
              <Typography.Title
                className="user-name mb-0"
                level={2}
                ellipsis={{ tooltip: data.title }}
              >
                {data.title}
              </Typography.Title>

              <Tag
                className="text-uppercase font-12 mr-0 mt-1"
                color="geekblue"
              >
                {data.type}
              </Tag>
            </Col>

            <Col xs={24} sm={15} lg={15} md={15} xl={9} xxl={9}>
              <Row>
                <Col span={12}>
                  <Space direction="vertical" size={12}>
                    {showContactInfo && <strong>Phone</strong>}

                    <strong>Email</strong>

                    {data.experience && <div>Years of Experience</div>}

                    {data.website && <div>Website</div>}
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical" size={12}>
                    {showContactInfo && <strong>{data.phoneNumber}</strong>}

                    <a className="d-block" href={`mailto:${data.email}`}>
                      {data.email}
                    </a>

                    {data.experience && <div>{data.experience}</div>}

                    {data.website && <div>{data.website}</div>}
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>

        <br />
        <br />

        <Content className="vendor-details-content">
          <Tabs size="large">
            <Tabs.TabPane key="about" tab="About">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </Tabs.TabPane>

            <Tabs.TabPane key="services" tab="Services">
              <Services data={get(data, "services")} />
            </Tabs.TabPane>

            <Tabs.TabPane key="photos" tab="Photos">
              <Photos data={get(data, "photos")} />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Spin>
  );
}
