import {
  ClockCircleTwoTone,
  CheckOutlined,
  BellOutlined,
} from "@ant-design/icons";
import React, { useMemo, useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Layout,
  Popconfirm,
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
import { get, isEmpty, filter } from "lodash";
import { documentId, where } from "firebase/firestore";
import dayjs from "dayjs";

import BlobImg2 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg3 from "../../../../assets/images/shapes/shape-3.svg";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";
import {
  getEventsByMonth,
  getInvitees,
  updateInviteStatus,
} from "../../../../services/database";
import { appTheme, buttonActionTheme } from "../../../../assets/js/theme";
import {
  commonPopConfirmProp,
  EVENT_STATUSES,
  INVITE_STATUSES,
} from "../../../../constants/app";
import IconFont from "../../../../components/icons/Index";
import { timeRangeString } from "../../../../helpers/timestamp";
import Countdown from "../../../../components/countdown/Index";
import { EventsListCalendar } from "../../../../components/calendar";

const { Header, Content } = Layout;

export default function Dashboard({ user }) {
  const [bookedEventIds, setBookedEventIds] = useState();
  const [pendingEventIds, setPendingEventIds] = useState();
  const [reload, setReload] = useState(false);

  const vendorEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchEventIds(isCancel);

    async function fetchEventIds(isCancel) {
      if (isCancel) return;

      const invitees = await getInvitees({
        inviteeId: vendorEmail,
      });

      const bookedEventIds = [];
      const pendingEventIds = [];
      invitees.forEach((i) => {
        if (i.status === INVITE_STATUSES.accepted.text) {
          bookedEventIds.push(i.eventId);
        } else if (i.status === INVITE_STATUSES.pending.text) {
          pendingEventIds.push(i.eventId);
        }
      });

      setBookedEventIds(bookedEventIds);
      setPendingEventIds(pendingEventIds);
    }

    return () => {
      isCancel = true;
    };
  }, [vendorEmail, reload]);

  const transformOngoingEvents = (data) => {
    return filter(data, (e) => e.record.status === EVENT_STATUSES.booked.text);
  };

  const transformPendingInvites = (data) => {
    return filter(data, (e) => e.record.status === EVENT_STATUSES.ongoing.text);
  };

  const upcomingEventsConstraints = useMemo(() => {
    if (isEmpty(bookedEventIds)) return [];

    return [where(documentId(), "in", bookedEventIds)];
  }, [bookedEventIds]);

  const inviteePendingConstraints = useMemo(() => {
    if (isEmpty(pendingEventIds)) return [];

    return [where(documentId(), "in", pendingEventIds)];
  }, [pendingEventIds]);

  return (
    <Layout prefixCls="vendor-dashboard-layout">
      <Header prefixCls="account-header" className="dashboard-header">
        <div>
          <span className="font-12">WELCOME</span>
          <h5>{getDisplayName(user)}</h5>
        </div>

        <Popover
          title="Notifications"
          content="Coming Soon!!"
          placement="bottomRight"
          showArrow={false}
          trigger="click"
        >
          <BellOutlined className="font-20" />
        </Popover>
      </Header>

      <Content>
        <Row gutter={[24, 24]}>
          <Col xxl={10} xl={12} lg={24} md={24} sm={24} xs={24}>
            <ScrollableCard
              title="Upcoming Events"
              resource={isEmpty(bookedEventIds) ? null : "events"}
              constraints={upcomingEventsConstraints}
              transformData={transformOngoingEvents}
              blobImg={BlobImg3}
            >
              {(item) => {
                return (
                  <CardEventItem
                    id={get(item, "id")}
                    item={get(item, "record")}
                    inviteeId={vendorEmail}
                  />
                );
              }}
            </ScrollableCard>
          </Col>

          <Col xxl={10} xl={12} lg={24} md={24} sm={24} xs={24}>
            <ScrollableCard
              title="Invites Pending"
              resource={isEmpty(pendingEventIds) ? null : "events"}
              constraints={inviteePendingConstraints}
              transformData={transformPendingInvites}
              blobImg={BlobImg2}
            >
              {(item) => {
                return (
                  <CardEventItem
                    id={get(item, "id")}
                    item={get(item, "record")}
                    inviteeId={vendorEmail}
                    setReload={setReload}
                  />
                );
              }}
            </ScrollableCard>
          </Col>
        </Row>

        <br />
        <br />

        <Row gutter={[24, 24]}>
          <Col xl={20} lg={24} md={24} sm={24} xs={24}>
            <EventCalendar params={{ vendorEmail }} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

function EventCalendar({ params = {} }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorEmail = get(params, "vendorEmail");

  useEffect(() => {
    let isCancel = false;

    // fetchDataSource(isCancel);

    // async function fetchDataSource(isCancel) {
    //   if (isCancel) return;

    //   try {
    //     setLoading(true);
    //     const data = await getEventsByMonth(vendorEmail, selectedDate);
    //     setDataSource(data);
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    return () => {
      isCancel = true;
    };
  }, [selectedDate, vendorEmail]);

  return (
    <EventsListCalendar
      dataSource={dataSource}
      loading={loading}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}

function CardEventItem({ id, item, inviteeId, setReload }) {
  const { title, location, fromDate, toDate, status } = item || {};

  const fromDateJs = dayjs(fromDate.toDate());
  const toDateJs = dayjs(toDate.toDate());

  const timeText = timeRangeString(fromDateJs, toDateJs);
  const isSameDay = fromDateJs.isSame(toDateJs, "day");

  const onAcceptInvite = async () => {
    await updateInviteStatus(id, inviteeId, INVITE_STATUSES.accepted.text);
    setReload((s) => !s);
  };

  const onDeclineInvite = async () => {
    await updateInviteStatus(id, inviteeId, INVITE_STATUSES.declined.text);
    setReload((s) => !s);
  };

  return (
    <Space className="w-100" size={20} align="start" wrap>
      <div className="date-badge">
        <div>
          <h3 style={{ lineHeight: "3rem" }}>{fromDateJs.format("DD")}</h3>
          <div className="font-12">{fromDateJs.format("MMM YYYY")}</div>
        </div>

        {!isSameDay && (
          <>
            <div className="font-12 mt-1">TO</div>

            <div>
              <h3 style={{ lineHeight: "3rem" }}>{toDateJs.format("DD")}</h3>
              <div className="font-12">{toDateJs.format("MMM YYYY")}</div>
            </div>
          </>
        )}
      </div>

      <Space
        className="justify-content-around h-100"
        direction="vertical"
        align="baseline"
        size={15}
        wrap
      >
        <div>
          <Typography.Title
            className="mb-1"
            level={3}
            ellipsis={{ tooltip: title }}
            style={{ width: 400 }}
          >
            {title}
          </Typography.Title>

          <Space size={5}>
            <IconFont type="icon-location" className="font-16" />

            <Typography.Text
              className="font-14"
              style={{ maxWidth: 400 }}
              ellipsis={{ tooltip: location }}
            >
              {location}
            </Typography.Text>
          </Space>

          <br />

          <Space className="font-14">
            <ClockCircleTwoTone twoToneColor={appTheme.colorPrimary} />
            <span>{timeText}</span>
          </Space>
        </div>

        {status === EVENT_STATUSES.ongoing.text ? (
          <Space size={10} wrap>
            <ConfigProvider theme={{ token: buttonActionTheme }}>
              <Button type="link" onClick={onAcceptInvite} danger>
                Accept
              </Button>
            </ConfigProvider>

            <Popconfirm
              title="Are you sure you want to cancel this event?"
              onConfirm={onDeclineInvite}
              {...commonPopConfirmProp}
            >
              <Button type="link" icon={<CheckOutlined />} danger>
                Cancel
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Countdown value={fromDateJs} />
        )}
      </Space>
    </Space>
  );
}
