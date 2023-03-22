import { CalendarTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
import React from "react";
import { Badge, Card, Empty, List, Space, Typography } from "antd";
import { find, get } from "lodash";
import dayjs from "dayjs";

import {
  dateRangeString,
  isDateInRange,
  timeRangeString,
} from "../../../helpers/timestamp";
import CalendarView from "../viewer/Index";
import { EVENT_STATUSES } from "../../../constants/app";
import { appTheme } from "../../../assets/js/theme";
import IconFont from "../../icons/Index";

export default function EventsListCalendar({
  dataSource,
  loading,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <Card
      className="events-calendar"
      title={`Events of the month (${selectedDate.format("MMMM YYYY")})`}
      hoverable={false}
    >
      <Card.Grid className="p-0" style={{ width: "60%" }} hoverable={false}>
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
}

function renderItem({ fromDate, location, status, title, toDate }) {
  const fromDateJs = dayjs(fromDate.toDate());
  const toDateJs = dayjs(toDate.toDate());

  const dateText = dateRangeString(fromDateJs, toDateJs);
  const timeText = timeRangeString(fromDateJs, toDateJs);

  const statusObj = find(EVENT_STATUSES, (e) => e.text === status);

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
