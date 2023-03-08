import { InboxOutlined } from "@ant-design/icons";
import React from "react";
import { Col, Form, Input, Row, Select, Upload } from "antd";

import { eventTypesOptions } from "../../../../../../constants/dropdown";
import LocationSelect from "../../../../../../components/locationSelect/Index";

export default function BasicInfoStep() {
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
