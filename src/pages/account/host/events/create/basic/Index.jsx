import { InboxOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Col, Form, Input, Row, Select, Upload, DatePicker } from "antd";
import dayjs from "dayjs";

import { eventTypesOptions } from "../../../../../../constants/dropdown";
import { LocationSelect } from "../../../../../../components/fields";
import { getEventsByMonth } from "../../../../../../services/database";
import { isDateInRange } from "../../../../../../helpers/timestamp";

const { RangePicker } = DatePicker;

const initStartDate = dayjs().set("hour", 18).set("minute", 0).set("second", 0);

export default function BasicInfoStep({ hostEmail }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "month"));

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      let prevDate;
      if (selectedDate.month() % 2) {
        prevDate = selectedDate.clone().subtract(1, "month");
      } else {
        prevDate = selectedDate.clone().add(1, "month");
      }

      const leftMonth = await getEventsByMonth(hostEmail, prevDate);
      const rightMonth = await getEventsByMonth(hostEmail, selectedDate);
      setEvents([...leftMonth, ...rightMonth]);
    }

    return () => {
      isCancel = true;
    };
  }, [selectedDate, hostEmail]);

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
        rules={[{ required: true }]}
        initialValue={[
          initStartDate,
          initStartDate.clone().add(1, "day").set("hour", 0),
        ]}
      >
        <RangePicker
          className="w-100"
          size="large"
          onPanelChange={(value, mode) => {
            console.log({ value, mode });
            setSelectedDate(value[0] || value[1]);
          }}
          disabledDate={(current) => {
            return events.some((event) => {
              return isDateInRange(
                current,
                event.fromDate.toDate(),
                event.toDate.toDate()
              );
            });
          }}
          dateRender={(current) => {
            const isEvent = events.some((event) => {
              return isDateInRange(
                current,
                event.fromDate.toDate(),
                event.toDate.toDate()
              );
            });

            const style = {};
            if (isEvent) {
              style.backgroundColor = "red";
              style.color = "#fff";
            }

            return (
              <div className="ant-picker-cell-inner" style={style}>
                {current.date()}
              </div>
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

      <Form.Item name="bannerUrl" label="Banner">
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
