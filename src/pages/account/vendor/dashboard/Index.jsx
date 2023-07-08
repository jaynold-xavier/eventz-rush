import {
  BellOutlined,
  CheckOutlined,
  ClockCircleTwoTone,
  CloseOutlined,
} from "@ant-design/icons";
import React, { useMemo, useEffect, useState, useRef } from "react";
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
import { get, isEmpty, filter, some } from "lodash";
import { documentId, where } from "firebase/firestore";
import dayjs from "dayjs";

import BlobImg2 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg3 from "../../../../assets/images/shapes/shape-3.svg";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";
import {
  getEventsByMonth,
  getInvitees,
  updateInvitee,
  updateInviteStatus,
} from "../../../../services/database";
import { appTheme, navLinkTheme } from "../../../../assets/js/theme";
import {
  commonPopConfirmProp,
  EVENT_STATUSES,
  INVITE_STATUSES,
  USER_ROLES,
} from "../../../../constants/app";
import IconFont from "../../../../components/icons/Index";
import { timeRangeString } from "../../../../helpers/timestamp";
import Countdown from "../../../../components/countdown/Index";
import { EventsListCalendar } from "../../../../components/calendar";
import { SelectServicesLayout as SelectServicesDrawer } from "../../../vendors";

const { Header, Content } = Layout;

export default function Dashboard({ user }) {
  const [bookedEventIds, setBookedEventIds] = useState();
  const [pendingEventIds, setPendingEventIds] = useState();
  const [selectServicesVisible, setSelectServicesVisible] = useState(false);
  const [reload, setReload] = useState(false);

  const eventIdsRef = useRef();
  const selectedEventIdRef = useRef();
  const eventsWithRequestRef = useRef();

  const vendorEmail = get(user, "email");

  useEffect(() => {
    let isCancel = false;

    fetchEventIds(isCancel);

    async function fetchEventIds(isCancel) {
      if (isCancel) return;

      const invitees = await getInvitees({
        inviteeId: vendorEmail,
      });

      console.log({ invitees });

      const eventIds = [];
      const bookedEventIds = [];
      const pendingEventIds = [];
      const eventsWithRequest = [];
      invitees.forEach((i) => {
        eventIds.push(i.eventId);
        if (i.status === INVITE_STATUSES.accepted.text) {
          bookedEventIds.push(i.eventId);
        } else if (i.status === INVITE_STATUSES.pending.text) {
          pendingEventIds.push(i.eventId);

          if (isEmpty(i.services)) {
            eventsWithRequest.push(i.eventId);
          }
        }
      });

      setBookedEventIds(bookedEventIds);
      setPendingEventIds(pendingEventIds);
      eventsWithRequestRef.current = eventsWithRequest;
      eventIdsRef.current = eventIds;
    }

    return () => {
      isCancel = true;
    };
  }, [vendorEmail, reload]);

  const transformUpcomingEvents = (data) => {
    return filter(
      data,
      (e) =>
        e.record.status === EVENT_STATUSES.booked.text &&
        e.record.fromDate.toDate() > new Date()
    );
  };

  const selectServices = async (data) => {
    if (!data) return;

    const inviteeInfo = {
      eventId: selectedEventIdRef.current,
      inviteeId: vendorEmail,
      status: INVITE_STATUSES.accepted.text,
      type: USER_ROLES.vendor.text,
    };

    if (data.services) {
      inviteeInfo.services = data.services;
    }

    if (data.amount) {
      inviteeInfo.amount = data.amount;
    }

    await updateInvitee(inviteeInfo.eventId, vendorEmail, inviteeInfo);

    setReload((s) => !s);
  };

  const onSelectServicesClick = (id) => {
    selectedEventIdRef.current = id;
    setSelectServicesVisible(true);
  };

  const transformPendingInvites = (data) => {
    return filter(
      data,
      (e) =>
        e.record.status === EVENT_STATUSES.ongoing.text &&
        e.record.fromDate.toDate() > new Date()
    );
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

        {/* <Popover
          title="Notifications"
          content="Coming Soon!!"
          placement="bottomRight"
          showArrow={false}
          trigger="click"
        >
          <BellOutlined className="font-20" />
        </Popover> */}
      </Header>

      <Content>
        <Row gutter={[24, 24]}>
          <Col
            className="ml-auto"
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            xxl={10}
          >
            <ScrollableCard
              title="Upcoming Events"
              resource={isEmpty(bookedEventIds) ? null : "events"}
              constraints={upcomingEventsConstraints}
              transformData={transformUpcomingEvents}
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

          <Col
            className="mr-auto"
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            xxl={10}
          >
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
                    onSelectServicesClick={onSelectServicesClick}
                    eventsWithRequest={eventsWithRequestRef.current}
                  />
                );
              }}
            </ScrollableCard>
          </Col>
        </Row>

        <br />
        <br />

        <EventCalendar
          eventIds={eventIdsRef.current}
          params={{ vendorEmail }}
        />

        <SelectServicesDrawer
          vendorInfo={user}
          open={selectServicesVisible}
          onClose={(e) => setSelectServicesVisible((s) => !s)}
          onSave={selectServices}
          selectable={!!selectedEventIdRef.current}
        />
      </Content>
    </Layout>
  );
}

function EventCalendar({ eventIds, params = {} }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorEmail = get(params, "vendorEmail");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        if (!isEmpty(eventIds)) {
          const data = await getEventsByMonth(selectedDate, { eventIds });
          console.log({ eventIds, data });
          setDataSource(data);
        }
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [selectedDate, vendorEmail, eventIds]);

  return (
    <EventsListCalendar
      dataSource={dataSource}
      loading={loading}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}

function CardEventItem({
  id,
  item,
  inviteeId,
  setReload,
  onSelectServicesClick,
  eventsWithRequest,
}) {
  const { title, location, fromDate, toDate, status } = item || {};

  const onAcceptInvite = async () => {
    await updateInviteStatus(id, inviteeId, INVITE_STATUSES.accepted.text);
    setReload((s) => !s);
  };

  const onDeclineInvite = async () => {
    await updateInviteStatus(id, inviteeId, INVITE_STATUSES.declined.text);
    setReload((s) => !s);
  };

  const fromDateJs = dayjs(fromDate.toDate());
  const toDateJs = dayjs(toDate.toDate());

  const timeText = timeRangeString(fromDateJs, toDateJs);
  const isSameDay = fromDateJs.isSame(toDateJs, "day");

  const hasRequest = some(eventsWithRequest, (eventId) => eventId === id);

  const actions = [];
  if (hasRequest) {
    actions.push(
      <ConfigProvider
        key={0}
        theme={{
          token: {
            colorPrimary: "gold",
            colorBorder: "gold",
          },
        }}
      >
        <Button
          type="primary"
          onClick={(e) => onSelectServicesClick(id)}
          ghost
          block
        >
          Select Services
        </Button>
      </ConfigProvider>
    );
  } else {
    if (status === EVENT_STATUSES.ongoing.text) {
      actions.push(
        <ConfigProvider
          key={1}
          theme={{
            token: {
              ...appTheme,
              colorLink: navLinkTheme.colorPrimary,
            },
          }}
        >
          <Popconfirm
            title="Are you sure you want to accept this event?"
            onConfirm={onAcceptInvite}
            {...commonPopConfirmProp}
          >
            <Button type="link" icon={<CheckOutlined />}>
              Accept
            </Button>
          </Popconfirm>
        </ConfigProvider>
      );

      actions.push(
        <ConfigProvider key={2} theme={{ token: appTheme }}>
          <Popconfirm
            title="Are you sure you want to cancel this event?"
            onConfirm={onDeclineInvite}
            {...commonPopConfirmProp}
          >
            <Button type="link" icon={<CloseOutlined />} danger>
              Decline
            </Button>
          </Popconfirm>
        </ConfigProvider>
      );

      actions.push(
        <ConfigProvider
          key={3}
          theme={{
            token: {
              colorPrimary: "gold",
              colorBorder: "gold",
              colorLink: "gold",
            },
          }}
        >
          <Button
            type="link"
            onClick={(e) => onSelectServicesClick(null)}
            ghost
            block
          >
            View Services
          </Button>
        </ConfigProvider>
      );
    } else if (status === EVENT_STATUSES.booked.text) {
      actions.push(<Countdown key={4} value={fromDateJs} />);
    }
  }

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

        <Space size={10} wrap>
          {actions}
        </Space>
      </Space>
    </Space>
  );
}
