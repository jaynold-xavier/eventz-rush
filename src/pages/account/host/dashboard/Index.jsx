import {
  PlusOutlined,
  CalendarTwoTone,
  ClockCircleTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Layout,
  List,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import { get, isEmpty, map } from "lodash";
import { orderBy, Timestamp, where } from "firebase/firestore";
import dayjs from "dayjs";

import BlobImg1 from "../../../../assets/images/shapes/shape-1.svg";
import BlobImg2 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg3 from "../../../../assets/images/shapes/shape-3.svg";
import BlobImg4 from "../../../../assets/images/shapes/shape-4.svg";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";
import CalendarView from "../../../../components/calendar/view/Index";
import { getEventsByMonth, updateEvent } from "../../../../services/database";
import { appTheme, buttonActionTheme } from "../../../../assets/js/theme";
import {
  commonPopConfirmProp,
  EVENT_STATUSES,
} from "../../../../constants/app";
import IconFont from "../../../../components/icons/Index";
import { appRoutes } from "../../../../constants/routes";
import {
  dateRangeString,
  isDateInRange,
  timeRangeString,
} from "../../../../helpers/timestamp";

const { Header, Content } = Layout;

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <Layout prefixCls="host-dashboard-layout">
      <Header prefixCls="host-dashboard-header">
        <span className="font-12">WELCOME</span>
        <h5>{getDisplayName(user)}</h5>
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
              {(item) => {
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
            <EventCalendar params={{ email: get(user, "email") }} />
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

  const hostEmail = get(params, "email");
  const monthString = selectedDate && selectedDate.format("YYYY-MM");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const data = await getEventsByMonth(hostEmail, monthString);
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [monthString, hostEmail]);

  return (
    <Card
      title={`Events of the month (${selectedDate.format("MMMM YYYY")})`}
      className="events-calendar"
      hoverable={false}
    >
      <Card.Grid
        className={"p-0" + (isEmpty(dataSource) ? " d-flex" : "")}
        style={{ width: "60%" }}
        hoverable={false}
      >
        <List
          className="w-100 m-auto"
          dataSource={dataSource}
          renderItem={renderItem}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No Events during this month"
              />
            ),
          }}
          style={{ maxHeight: 400, overflow: "auto" }}
        />
      </Card.Grid>

      <Card.Grid className="p-0" style={{ width: "40%" }} hoverable={false}>
        <CalendarView
          value={selectedDate}
          onChange={setSelectedDate}
          dateCellRender={(value) => {
            value = value.startOf("day");
            const isEvent = dataSource.some((event) => {
              return isDateInRange(
                value,
                event.fromDate.toDate(),
                event.toDate.toDate()
              );
            });

            if (isEvent) {
              return value.format("DD");
            }
          }}
        />
      </Card.Grid>
    </Card>
  );

  function renderItem({
    bannerURL,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
  }) {
    const fromDateJs = dayjs(fromDate.toDate());
    const toDateJs = dayjs(toDate.toDate());

    const dateText = dateRangeString(fromDateJs, toDateJs);
    const timeText = timeRangeString(fromDateJs, toDateJs);

    const statusObj = get(EVENT_STATUSES, status);

    return (
      <List.Item
        className="align-items-start"
        style={{ borderLeft: `2px solid ${appTheme.colorPrimary}` }}
      >
        <List.Item.Meta
          title={title}
          description={
            <>
              <Space size={5}>
                <IconFont
                  type="icon-location"
                  className="font-16"
                  style={{ color: appTheme.colorPrimary }}
                />

                <Typography.Text
                  className="font-14 text-grey"
                  style={{ maxWidth: 300 }}
                  ellipsis={{ tooltip: location }}
                >
                  {location}
                </Typography.Text>
              </Space>

              <br />

              <Space size={20}>
                <Space className="font-14">
                  <CalendarTwoTone twoToneColor={appTheme.colorPrimary} />
                  <span className="text-grey">{dateText}</span>
                </Space>

                <Space className="font-14">
                  <ClockCircleTwoTone twoToneColor={appTheme.colorPrimary} />
                  <span className="text-grey">{timeText}</span>
                </Space>
              </Space>
            </>
          }
        />

        {statusObj && (
          <Badge
            className="position-absolute"
            color={get(statusObj, "color")}
            text={<span className="font-14">{get(statusObj, "text")}</span>}
            style={{ right: "1rem" }}
          />
        )}
      </List.Item>
    );
  }
}

function CardEventItem({ id, item, continueEvent }) {
  const { title, location, fromDate, toDate, status } = item || {};

  const fromDateJs = dayjs(fromDate.toDate());
  const toDateJs = dayjs(toDate.toDate());

  const timeText = timeRangeString(fromDateJs, toDateJs);
  const isSameDay = fromDateJs.isSame(toDateJs, "day");

  const cancelEvent = async () => {
    item.status = EVENT_STATUSES.cancelled.text;
    await updateEvent(id, item);
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
          <div>
            <Statistic.Countdown
              format="DD : HH : mm : ss"
              value={fromDateJs}
              style={{ lineHeight: "1rem" }}
            />
            <Space
              className="text-light-grey font-10 font-weight-bold"
              size={30}
              style={{ marginLeft: 5 }}
            >
              <span>Days</span>
              <span>Hours</span>
              <span>Mins</span>
              <span>Secs</span>
            </Space>
          </div>
        )}
      </Space>
    </Space>
  );
}
