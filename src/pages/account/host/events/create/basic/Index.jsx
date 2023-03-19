import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
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
  message,
} from "antd";
import dayjs from "dayjs";
import { get } from "lodash";

import { eventTypesOptions } from "../../../../../../constants/dropdown";
import {
  ImageUploader,
  LocationSelect,
} from "../../../../../../components/fields";
import { getEventsByMonth } from "../../../../../../services/database";
import { isDateInRange } from "../../../../../../helpers/timestamp";
import { appTheme } from "../../../../../../assets/js/theme";
import { uploadResource } from "../../../../../../services/storage";
import { RichTextEditor } from "../../../../../../components/fields";
import { maxAdvanceBookingPeriod } from "../../../../../../constants/app";

const { RangePicker } = DatePicker;

const initStartDate = dayjs().set("hour", 18).set("minute", 0).set("second", 0);

const getBase64 = (img, callback) => {
  console.log({ img, callback });
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  console.log({ file });
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

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
        <RichTextEditor />
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

              const maxBookingPeriodParts = maxAdvanceBookingPeriod.split(" ");
              const minBookingDate = from.subtract(
                maxBookingPeriodParts[0],
                maxBookingPeriodParts[1]
              );

              if (minBookingDate.isAfter(dayjs())) {
                return Promise.reject(
                  new Error(
                    `Sorry, cannot book an event within ${maxAdvanceBookingPeriod} of the start of the event`
                  )
                );
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
        <BannerUploader
          className="banner-uploader"
          listType="picture-card"
          accept="image/*"
        />
      </Form.Item>
    </>
  );
}

function BannerUploader({ value, onChange, ...rest }) {
  const handleOnChange = ({ fileList }) => {
    onChange(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ImageUploader
      className="banner-uploader"
      listType="picture-card"
      accept="image/*"
      maxCount={1}
      value={value}
      onChange={handleOnChange}
      {...rest}
    >
      {uploadButton}
    </ImageUploader>
  );
}
