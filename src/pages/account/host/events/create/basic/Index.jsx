import { InboxOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Upload,
  DatePicker,
  Tooltip,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { get } from "lodash";

import { eventTypesOptions } from "../../../../../../constants/dropdown";
import { LocationSelect } from "../../../../../../components/fields";
import { getEventsByMonth } from "../../../../../../services/database";
import { isDateInRange } from "../../../../../../helpers/timestamp";
import { appTheme } from "../../../../../../assets/js/theme";

const { RangePicker } = DatePicker;

const initStartDate = dayjs().set("hour", 18).set("minute", 0).set("second", 0);

export default function BasicInfoStep({ hostEmail }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const monthString = selectedDate && selectedDate.format("YYYY-MM");

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      const eventsByMonth = await getEventsByMonth(hostEmail, monthString);
      setEvents(eventsByMonth);
    }

    return () => {
      isCancel = true;
    };
  }, [monthString, hostEmail]);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter Event Title" size="large" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              placeholder="Enter Event Type"
              size="large"
              options={eventTypesOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter Event Description" size="large" />
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        wrapperCol={{ span: 12 }}
        initialValue={[
          initStartDate,
          initStartDate.clone().add(1, "day").set("hour", 0),
        ]}
        rules={[
          { required: true },
          {
            validator: (rule, value) => {
              const [from, to] = value || [];

              if (!(from && to)) {
                return Promise.resolve();
              }

              const event = events.find((e) => {
                return (
                  isDateInRange(
                    dayjs(e.fromDate.toDate()),
                    from.toDate(),
                    to.toDate()
                  ) ||
                  isDateInRange(
                    dayjs(e.toDate.toDate()),
                    from.toDate(),
                    to.toDate()
                  )
                );
              });

              if (event) {
                return Promise.reject(
                  new Error(
                    "You already have an event during this period. Please select another period"
                  )
                );
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <RangePicker
          className="w-100"
          size="large"
          onPanelChange={(value, mode) => {
            console.log({ value, mode });
            setSelectedDate(value[0] || value[1]);
          }}
          renderExtraFooter={(mode) => {
            return <Tag color="red">Event</Tag>;
          }}
          dateRender={(current) => {
            const event = events.find((event) => {
              return isDateInRange(
                current,
                event.fromDate.toDate(),
                event.toDate.toDate()
              );
            });

            const style = {};
            if (event) {
              style.backgroundColor = "#cf1322";
              style.fontSize = 14;
              style.color = "#fff";
            }

            return (
              <Tooltip
                title={
                  event && (
                    <>
                      <div>{get(event, "title")}</div>
                      <Tag className="font-12" color={appTheme.colorPrimary}>
                        {get(event, "type")}
                      </Tag>
                    </>
                  )
                }
              >
                <div className="ant-picker-cell-inner" style={style}>
                  {current.date()}
                </div>
              </Tooltip>
            );
          }}
          showSecond={false}
          minuteStep={30}
          showTime
        />
      </Form.Item>

      <Form.Item name="location" label="Location" rules={[{ required: true }]}>
        <LocationSelect />
      </Form.Item>

      <Form.Item name="bannerURL" label="Banner">
        <Upload.Dragger>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Upload a banner image to display on your event details
          </p>
        </Upload.Dragger>
      </Form.Item>
    </>
  );
}
