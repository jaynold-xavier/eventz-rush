import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Col,
  Layout,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { filter, get, isEmpty, map } from "lodash";

import { getReviews, getUser } from "../../../services/database";
import useBackground from "../../../hooks/useBackground";
import { ReviewsViewer } from "../../review";
import { FilteredTabs } from "../../../components/tabs";
import Services from "./services/Index";
import Photos from "./photos/Index";
import { getDisplayName } from "../../../helpers/auth";

const { Header, Content } = Layout;

const avatarProps = {
  shape: "circle",
  size: { xs: 100, sm: 130, md: 120, lg: 120, xl: 150, xxl: 150 },
};

export default function VendorDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [reviews, setReviews] = useState();

  useBackground("linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)");

  useEffect(() => {
    let isCancel = false;

    initData(isCancel);

    async function initData(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const values = await Promise.all([fetchVendor(), fetchReviews()]);
        const [vendor = {}, reviews = []] = values;

        setData(vendor);
        setReviews(reviews);
      } catch (error) {
        console.log("vendor details", { error });
      } finally {
        setLoading(false);
      }
    }

    async function fetchVendor() {
      const vendor = await getUser(id);
      return vendor;
    }

    async function fetchReviews() {
      const reviews = await getReviews({ inviteeId: id });
      return map(reviews, (r) => {
        if (r.description) {
          r.description = '"' + r.description + '"';
        }
        return r;
      });
    }

    return () => {
      isCancel = true;
    };
  }, [id]);

  const showContactInfo =
    get(data, "configurations.showContactInfo") && get(data, "phoneNumber");

  const filterTabs = (children) => {
    return filter(children, (c) => {
      if (c.key === "about") {
        return !!get(data, "description");
      }

      if (c.key === "photos") {
        return !isEmpty(get(data, "photos"));
      }

      if (c.key === "services") {
        const showServices = get(data, "configurations.showServices");
        return showServices && !isEmpty(get(data, "services"));
      }

      if (c.key === "reviews") {
        return !isEmpty(reviews);
      }

      return false;
    });
  };

  return (
    <Spin spinning={loading}>
      <Layout className="vendor-details-layout rounded container mt-5 mb-5">
        <Header prefixCls="vendor-general-info">
          <Row align="middle" gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Space>
                <Avatar
                  className="user-avatar"
                  src={get(data, "photoURL") || undefined}
                  {...avatarProps}
                />

                <div>
                  <Typography.Title
                    className="user-name mb-0"
                    level={2}
                    ellipsis={{ tooltip: getDisplayName(data) }}
                    style={{ maxWidth: 300 }}
                  >
                    {getDisplayName(data)}
                  </Typography.Title>

                  <Tag
                    className="text-uppercase font-12 mr-0 mt-1"
                    color="geekblue"
                  >
                    {data.type}
                  </Tag>
                </div>
              </Space>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row>
                <Col span={12}>
                  <Space direction="vertical" size={12}>
                    {showContactInfo && <strong>Phone</strong>}

                    <strong>Email</strong>

                    {data.experience && <strong>Years of Experience</strong>}

                    {data.website && <strong>Website</strong>}
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
          <FilteredTabs size="large" filter={filterTabs}>
            <Tabs.TabPane key="about" tab="About">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </Tabs.TabPane>

            <Tabs.TabPane key="services" tab="Services">
              <Services data={get(data, "services")} />
            </Tabs.TabPane>

            <Tabs.TabPane key="photos" tab="Photos" forceRender>
              <Photos data={get(data, "photos")} />
            </Tabs.TabPane>

            <Tabs.TabPane key="reviews" tab="Reviews">
              <ReviewsViewer dataSource={reviews} loading={loading} />
            </Tabs.TabPane>
          </FilteredTabs>
        </Content>
      </Layout>
    </Spin>
  );
}
