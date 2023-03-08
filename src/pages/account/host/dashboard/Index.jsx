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
  Empty,
  Layout,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import { get, isEmpty, map } from "lodash";
import dayjs from "dayjs";

import BlobImg1 from "../../../../assets/images/shapes/shape-1.svg";
import BlobImg2 from "../../../../assets/images/shapes/shape-2.svg";
import BlobImg3 from "../../../../assets/images/shapes/shape-3.svg";
import BlobImg4 from "../../../../assets/images/shapes/shape-4.svg";
import LocationIcon from "../../../../assets/images/icons/Location";

import { getDisplayName } from "../../../../helpers/auth";
import ScrollableCard from "../../../../components/card/scrollable/Index";
import CalendarView from "../../../../components/calendar/view/Index";
import { getEventsByMonth } from "../../../../services/database";
import { appTheme } from "../../../../assets/js/theme";
import { EVENT_STATUSES } from "../../../../constants/app";
import IconFont from "../../../../components/icons/Index";
import { appRoutes } from "../../../../constants/routes";
import { dateRangeString, timeString } from "../../../../helpers/timetamp";
import { orderBy, Timestamp, where } from "firebase/firestore";

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
          <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
            <ScrollableCard
              title="Upcoming Events"
              resource="events"
              constraints={[
                where("status", "==", EVENT_STATUSES.open.text),
                where("fromDate", ">", Timestamp.fromDate(new Date())),
                orderBy("fromDate"),
              ]}
              blobImg={BlobImg1}
            />
          </Col>

          <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
            <ScrollableCard
              title="Processing Events"
              resource="events"
              constraints={[
                where("status", "==", EVENT_STATUSES.processing.text),
                orderBy("fromDate", "asc"),
              ]}
              blobImg={BlobImg2}
            >
              {(item) => {
                return <CardEventItem item={item} />;
              }}
            </ScrollableCard>
          </Col>
        </Row>

        <br />
        <br />

        <Row gutter={[24, 24]}>
          <Col xl={18} lg={18} md={24} sm={24} xs={24}>
            <EventCalendar params={{ email: get(user, "email") }} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

function EventCalendar({ params = {} }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventsByMonth, setEventsByMonth] = useState([]);
  const [loading, setLoading] = useState(true);

  const hostEmail = get(params, "email");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const data = await getEventsByMonth(hostEmail, selectedDate);
        setEventsByMonth(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [selectedDate && selectedDate.month(), hostEmail]);

  const eventDates = map(eventsByMonth, (event) => [
    event.fromDate.toDate(),
    event.toDate.toDate(),
  ]);

  return (
    <Card hoverable={false}>
      <Card.Grid
        className={"p-0" + (isEmpty(eventsByMonth) ? " d-flex" : "")}
        style={{ width: "60%" }}
        hoverable={false}
      >
        <List
          className="w-100 m-auto"
          dataSource={eventsByMonth}
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
          style={{ maxHeight: 400 }}
        />
      </Card.Grid>

      <Card.Grid className="p-0" style={{ width: "40%" }} hoverable={false}>
        <CalendarView
          value={selectedDate}
          onChange={setSelectedDate}
          dateCellRender={(value) => {
            const isEvent = eventDates.some((event) => {
              const [from, to] = event;
              return (
                (from.getMonth() === value.month() &&
                  from.getDate() === value.date()) ||
                (to.getMonth() === value.month() &&
                  to.getDate() === value.date())
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
    bannerUrl,
    description,
    fromDate,
    location,
    status,
    title,
    toDate,
  }) {
    const fromDateJs = fromDate && dayjs(fromDate.toDate());
    const toDateJs = toDate && dayjs(toDate.toDate());

    const dateText = dateRangeString(fromDateJs, toDateJs);
    const timeText = timeString(fromDateJs, toDateJs);

    const statusColor = get(
      EVENT_STATUSES,
      `${status && status.toLowerCase()}.color`
    );

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

                <Typography.Text className="font-14 text-grey" ellipsis>
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

        <Badge
          className="position-absolute"
          color={statusColor}
          text={<span className="font-14">{status}</span>}
          style={{ right: "1rem" }}
        />
      </List.Item>
    );
  }
}

