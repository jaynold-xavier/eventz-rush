import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Col,
  Image,
  Layout,
  List,
  message,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { cloneDeep, filter, find, get, map } from "lodash";

import {
  addInvitee,
  createEvent,
  getEvent,
  getInvitees,
  getUser,
  updateEvent,
} from "../../../services/database";
import { appTheme } from "../../../assets/js/theme";
import {
  EVENT_STATUSES,
  INVITE_STATUSES,
  USER_ROLES,
} from "../../../constants/app";
import { appRoutes } from "../../../constants/routes";
import VendorItem from "../../vendors/list/item/Index";
import { canCancelEvent, canUpdateEvent } from "../../../helpers/validations";

const { Header, Content } = Layout;

const dateString = "dddd, MMMM YYYY hh:mm A";

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [vendors, setVendors] = useState();

  useEffect(() => {
    let isCancel = false;

    async function fetchInvitees(eventId) {
      const invitees = await getInvitees({ eventId });
      const promises = map(invitees, (i) => {
        return getUser(i.inviteeId);
      });

      return await Promise.all(promises);
    }

    async function initData(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);

        const event = await getEvent(id);
        if (event) {
          setData(event);

          const vendorsData = await fetchInvitees(id);
          if (vendorsData) {
            setVendors(vendorsData);
          }
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

  const onUpdateEvent = (e) => {
    navigate(appRoutes.account.events.update.replace("{id}", id));
  };

  const onCloneEvent = async (e) => {
    const clonedData = cloneDeep(data);
    delete clonedData.createdOn;
    clonedData.status = EVENT_STATUSES.ongoing.text;

    const clonedEventId = await createEvent(clonedData);
    if (!clonedEventId) return;

    const promises = map(vendors, (v) => {
      return addInvitee({
        eventId: clonedEventId,
        inviteeId: v.email,
        type: USER_ROLES.vendor.text,
      });
    });

    await Promise.all(promises);

    navigate(appRoutes.account.events.update.replace("{id}", clonedEventId));
  };

  const onCancelEvent = async (e) => {
    data.status = EVENT_STATUSES.cancelled.text;
    await updateEvent(id, data);

    message.success("Event cancelled!");

    navigate(appRoutes.account.dashboard);
  };

  const {
    bannerURL,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
    amount,
    type,
  } = data || {};

  const fromDateString =
    fromDate && dayjs(fromDate.toDate()).format(dateString);

  const toDateString = toDate && dayjs(toDate.toDate()).format(dateString);

  const statusObj = find(EVENT_STATUSES, (e) => e.text === status);

  const acceptedInvitees = filter(
    vendors,
    (i) => i.status === INVITE_STATUSES.accepted.text
  );

  return (
    <Layout prefixCls="event-details-layout">
      <Spin spinning={loading}>
        <Header prefixCls="event-details-header position-relative">
          {bannerURL && (
            <Image
              rootClassName="banner-img"
              src={bannerURL}
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
                {statusObj && (
                  <Badge
                    color={get(statusObj, "color")}
                    text={
                      <span className="font-14">{get(statusObj, "text")}</span>
                    }
                  />
                )}
              </Space>
            </div>

            <Space className="ml-auto" size={10}>
              {canUpdateEvent(data) && (
                <Button type="primary" onClick={onUpdateEvent}>
                  Update
                </Button>
              )}

              <Button type="primary" onClick={onCloneEvent}>
                Clone
              </Button>

              {canCancelEvent(data) && (
                <Button onClick={onCancelEvent}>Cancel</Button>
              )}
            </Space>
          </div>
        </Header>

        <Content prefixCls="event-details-content">
          <Row className="event-basic-info" gutter={0}>
            {description && (
              <Col span={24}>
                <strong className="font-14">Description</strong>
                <div
                  className="font-18 mt-1"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </Col>
            )}

            {fromDateString && (
              <Col span={6}>
                <strong className="font-14">From</strong>
                <div className="font-18 mt-1">{fromDateString}</div>
              </Col>
            )}

            {toDateString && (
              <Col span={6}>
                <strong className="font-14">To</strong>
                <div className="font-18 mt-1">{toDateString}</div>
              </Col>
            )}

            {location && (
              <Col span={6}>
                <strong className="font-14">Where</strong>
                <div className="font-18 mt-1">{location}</div>
              </Col>
            )}

            {amount && (
              <Col className="text-right" span={6}>
                <strong className="font-14">Total Cost</strong>
                <div className="font-18 mt-1">{amount}</div>
              </Col>
            )}

            <Col span={24}>
              <strong className="font-14">Vendors</strong>
              <VendorsList dataSource={acceptedInvitees} />
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  );
}

function VendorsList({ dataSource }) {
  return (
    <List
      className="vendors-list mt-1"
      dataSource={dataSource}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 2,
        xl: 3,
        xxl: 4,
        column: 3,
      }}
      renderItem={renderItem}
    />
  );

  function renderItem(item) {
    return <VendorItem data={item} />;
  }
}
