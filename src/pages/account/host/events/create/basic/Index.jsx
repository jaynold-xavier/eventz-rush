import React from "react";
import { Col, Form, Input, Row, Select, DatePicker, Tooltip, Tag } from "antd";
import { get } from "lodash";
import dayjs from "dayjs";

import { eventTypesOptions } from "../../../../../../constants/dropdown";
import {
  ImageUploader,
  LocationSelect,
} from "../../../../../../components/fields";
import { isDateInRange } from "../../../../../../helpers/timestamp";
import { appTheme } from "../../../../../../assets/js/theme";
import { RichTextEditor } from "../../../../../../components/fields";
import {
  DATETIME_DISPLAY_FORMAT,
  MAX_ADV_BOOKING_PERIOD,
} from "../../../../../../constants/app";

const { RangePicker } = DatePicker;

const initStartDate = dayjs().set("hour", 18).set("minute", 0).set("second", 0);

export default function BasicInfoStep({ events, setSelectedDate }) {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} lg={24} md={12} xl={12} xxl={12}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter Event Title" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} lg={24} md={12} xl={12} xxl={12}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              placeholder="Enter Event Type"
              size="large"
              options={eventTypesOptions}
              allowClear
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
        wrapperCol={{
          xs: 24,
          sm: 24,
          lg: 24,
          md: 12,
          xl: 12,
          xxl: 12,
        }}
        initialValue={[initStartDate, initStartDate.clone().add(24, "hour")]}
        rules={[
          { required: true },
          {
            validator: (rule, value) => {
              const [from, to] = value || [];

              if (!(from && to)) {
                return Promise.resolve();
              }

              const maxBookingPeriodParts = MAX_ADV_BOOKING_PERIOD.split(" ");
              const minBookingDate = from
                .clone()
                .subtract(maxBookingPeriodParts[0], maxBookingPeriodParts[1]);

              if (dayjs().isAfter(minBookingDate)) {
                return Promise.reject(
                  new Error(
                    `Sorry, cannot book an event within ${MAX_ADV_BOOKING_PERIOD} of the start of the event`
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
            setSelectedDate(value[0] || value[1]);
          }}
          renderExtraFooter={(mode) => {
            return <Tag color="red">Event</Tag>;
          }}
          separator="➔"
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
          format={DATETIME_DISPLAY_FORMAT}
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

  return (
    <ImageUploader
      className="banner-uploader"
      listType="picture-card"
      accept="image/*"
      maxCount={1}
      value={value}
      onChange={handleOnChange}
      {...rest}
    />
  );
}
