import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Col,
  Image,
  Layout,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { getEvent } from "../../../../../services/database";
import { appTheme } from "../../../../../assets/js/theme";
import dayjs from "dayjs";
import { get } from "lodash";
import { EVENT_STATUSES } from "../../../../../constants/app";

const { Header, Content } = Layout;

const dateString = "dddd, MMMM YYYY hh:mm A";

export default function EventDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    let isCancel = false;

    async function initData(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const event = await getEvent(id);
        console.log({ event });

        if (event) {
          setData(event);
        }
      } finally {
        setLoading(false);
      }
    }

    initData(isCancel);

    return () => {
      isCancel = true;
    };
  }, [id]);

  const {
    bannerUrl,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
    totalCost,
    type,
    vendors,
  } = data || {};

  const fromDateString =
    fromDate && dayjs(fromDate.toDate()).format(dateString);

  const toDateString = toDate && dayjs(toDate.toDate()).format(dateString);

  const statusColor = get(
    EVENT_STATUSES,
    `${status && status.toLowerCase()}.color`
  );

  return (
    <Layout prefixCls="event-details-layout">
      <Spin spinning={loading}>
        <Header prefixCls="event-details-header position-relative">
          {bannerUrl && (
            <Image
              rootClassName="banner-img"
              src={bannerUrl}
              width="100%"
              preview={false}
              alt="event-banner"
            />
          )}

          <div className="header-info">
            <div>
              <Typography.Title
                className="mb-1"
                level={3}
                ellipsis={{ tooltip: title }}
              >
                {title}
              </Typography.Title>

              <Space>
                <Tag color={appTheme.colorPrimary}>{type}</Tag>
                {status && (
                  <Badge
                    color={statusColor}
                    text={<span className="font-14">{status}</span>}
                  />
                )}
              </Space>
            </div>

            <Space className="ml-auto" size={10}>
              <Button type="primary">Update</Button>
              <Button type="primary">Clone</Button>
              <Button>Cancel</Button>
            </Space>
          </div>
        </Header>

        <Content prefixCls="event-details-content">
          <Row className="event-basic-info" gutter={0}>
            {description && (
              <Col span={24}>
                <strong>Description</strong>
                <div className="font-18 mt-3">{description}</div>
              </Col>
            )}

            {fromDateString && (
              <Col span={6}>
                <strong>From</strong>
                <div className="font-18 mt-3">{fromDateString}</div>
              </Col>
            )}

            {toDateString && (
              <Col span={6}>
                <strong>To</strong>
                <div className="font-18 mt-3">{toDateString}</div>
              </Col>
            )}

            {location && (
              <Col span={6}>
                <strong>Where</strong>
                <div className="font-18 mt-3">{location}</div>
              </Col>
            )}

            {totalCost && (
              <Col className="text-right" span={6}>
                <strong>Total Cost</strong>
                <div className="font-18 mt-3">{totalCost}</div>
              </Col>
            )}
          </Row>
        </Content>
      </Spin>
    </Layout>
  );
}
