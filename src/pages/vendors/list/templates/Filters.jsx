import { SearchOutlined, AudioOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { Col, DatePicker, Row, Select, Input, Form, Card } from "antd";

import { DISPLAY_DATE_FORMAT } from "../../../../constants/app";
import useVoice from "../../../../hooks/useVoice";
import appTheme from "../../../../assets/js/theme";
import { vendorOptions } from "../../../../constants/dropdown";

export default function Filters() {
  const [form] = Form.useForm();

  const { text, setText, isListening, listen, voiceSupported } = useVoice();

  useEffect(() => {
    form.setFieldValue("q", text);
  }, [form, text]);

  const onValuesChange = (value, values) => {
    console.log({ value, values });
  };

  return (
    <Card className="vendors-list-filters">
      <Form
        form={form}
        size="large"
        layout="vertical"
        onValuesChange={onValuesChange}
      >
        <Row className="w-100" gutter={[24, 32]}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <Form.Item name="q" noStyle>
              <Input
                placeholder="Search Vendors"
                onChange={(e) => setText(e.target.value)}
                prefix={
                  <SearchOutlined style={{ color: appTheme.colorPrimary }} />
                }
                suffix={
                  voiceSupported && (
                    <AudioOutlined
                      style={{ color: appTheme.colorPrimary }}
                      onClick={listen}
                    />
                  )
                }
                allowClear
              />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} sm={12} xs={12}>
            <Form.Item name="type" noStyle>
              <Select
                className="w-100"
                mode="tags"
                options={vendorOptions}
                placeholder="Select Type"
                allowClear
              />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} sm={12} xs={12}>
            <Form.Item name="event" noStyle>
              <Select
                className="w-100"
                size="large"
                placeholder="Select Events List"
              />
            </Form.Item>
          </Col>

          <Col lg={12} md={24} sm={24} xs={24}>
            <Form.Item name="availability" noStyle>
              <DatePicker.RangePicker
                className="w-100"
                placeholder={["Available From", "Available Till"]}
                format={DISPLAY_DATE_FORMAT}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
