import { PlusOutlined, ClockCircleTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Layout,
  message,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import { get } from "lodash";
import { orderBy, Timestamp, where } from "firebase/firestore";
import dayjs from "dayjs";

import BlobImg2 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg3 from "../../../../assets/images/shapes/shape-3.svg";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";
import { getEventsByMonth, updateEvent } from "../../../../services/database";
import { appTheme, buttonActionTheme } from "../../../../assets/js/theme";
import {
  commonPopConfirmProp,
  EVENT_STATUSES,
} from "../../../../constants/app";
import IconFont from "../../../../components/icons/Index";
import { appRoutes } from "../../../../constants/routes";
import { timeRangeString } from "../../../../helpers/timestamp";
import Countdown from "../../../../components/countdown/Index";
import { EventsListCalendar } from "../../../../components/calendar";

const { Header, Content } = Layout;

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <Layout prefixCls="host-dashboard-layout">
      <Header prefixCls="account-header" className="dashboard-header">
        <div>
          <span className="font-12">WELCOME</span>
          <h5>{getDisplayName(user)}</h5>
        </div>
      </Header>

      <Content>
        <div className="text-center">
          <Button
            className="create-event-btn"
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={(e) => navigate(appRoutes.account.events.create)}
            ghost
          >
            New Event
          </Button>
        </div>

        <br />
        <br />

        <Row gutter={[24, 24]}>
          <Col xxl={10} xl={12} lg={24} md={24} sm={24} xs={24}>
            <ScrollableCard
              title="Upcoming Events"
              resource="events"
              constraints={[
                where("hostEmail", "==", get(user, "email")),
                where("status", "==", EVENT_STATUSES.booked.text),
                where("fromDate", ">", Timestamp.fromDate(new Date())),
                orderBy("fromDate"),
              ]}
              blobImg={BlobImg3}
            >
              {(item) => {
                return (
                  <CardEventItem
                    id={get(item, "id")}
                    item={get(item, "record")}
                  />
                );
              }}
            </ScrollableCard>
          </Col>

          <Col xxl={10} xl={12} lg={24} md={24} sm={24} xs={24}>
            <ScrollableCard
              title="Ongoing Events"
              resource="events"
              constraints={[
                where("hostEmail", "==", get(user, "email")),
                where("status", "==", EVENT_STATUSES.ongoing.text),
                orderBy("fromDate", "asc"),
              ]}
              blobImg={BlobImg2}
            >
              {(item, setReload) => {
                return (
                  <CardEventItem
                    id={get(item, "id")}
                    item={get(item, "record")}
                    continueEvent={(e) =>
                      navigate(
                        appRoutes.account.events.update.replace(
                          "{id}",
                          get(item, "id")
                        )
                      )
                    }
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
            <EventCalendar params={{ hostEmail: get(user, "email") }} />
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

  const hostEmail = get(params, "hostEmail");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const data = await getEventsByMonth(hostEmail, selectedDate);
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [selectedDate, hostEmail]);

  return (
    <EventsListCalendar
      dataSource={dataSource}
      loading={loading}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}

function CardEventItem({ id, item, continueEvent, setReload }) {
  const { title, location, fromDate, toDate, status } = item || {};

  const fromDateJs = dayjs(fromDate.toDate());
  const toDateJs = dayjs(toDate.toDate());

  const timeText = timeRangeString(fromDateJs, toDateJs);
  const isSameDay = fromDateJs.isSame(toDateJs, "day");

  const cancelEvent = async () => {
    item.status = EVENT_STATUSES.cancelled.text;
    await updateEvent(id, item);

    setReload && setReload((s) => !s);

    message.success("Event cancelled!");
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
              <Button type="primary" onClick={(e) => continueEvent()} block>
                Continue
              </Button>
            </ConfigProvider>

            <ConfigProvider
              theme={{
                token: {
                  ...appTheme,
                  colorPrimary: "#858585",
                  colorBgContainer: undefined,
                },
              }}
            >
              <Popconfirm
                title="Are you sure you want to cancel this event?"
                onConfirm={(e) => cancelEvent()}
                {...commonPopConfirmProp}
              >
                <Button type="primary" block>
                  Cancel
                </Button>
              </Popconfirm>
            </ConfigProvider>
          </Space>
        ) : (
          <Countdown value={fromDateJs} />
        )}
      </Space>
    </Space>
  );
}
