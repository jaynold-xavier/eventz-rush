import { SearchOutlined, AudioOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { Col, DatePicker, Row, Select, Input, Form, Card } from "antd";
import { get } from "lodash";

import { DATE_DISPLAY_FORMAT } from "../../../../constants/app";
import useVoice from "../../../../hooks/useVoice";
import { appTheme } from "../../../../assets/js/theme";
import { vendorTypesOptions } from "../../../../constants/dropdown";

export default function Filters({ filters, setFilters }) {
  const { text, listen, voiceSupported } = useVoice();

  useEffect(() => {
    setFilters((s) => ({ ...s, q: text }));
  }, [setFilters, text]);

  return (
    <Card className="vendors-list-filters">
      <Row className="w-100" gutter={[24, 32]}>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Form.Item name="q" noStyle>
            <Input
              value={get(filters, "q")}
              placeholder="Search Vendors"
              onChange={(e) => {
                setFilters((s) => ({ ...s, q: e.target.value }));
              }}
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

        <Col lg={12} md={24} sm={24} xs={24}>
          <Form.Item name="availability" noStyle>
            <DatePicker.RangePicker
              className="w-100"
              placeholder={["Available From", "Available Till"]}
              separator="➔"
              format={DATE_DISPLAY_FORMAT}
              value={get(filters, "date")}
              onChange={(value) => setFilters((s) => ({ ...s, date: value }))}
            />
          </Form.Item>
        </Col>

        <Col lg={6} md={12} sm={12} xs={12}>
          <Form.Item name="type" noStyle>
            <Select
              className="w-100"
              mode="tags"
              options={vendorTypesOptions}
              value={get(filters, "type")}
              onChange={(value) => setFilters((s) => ({ ...s, type: value }))}
              placeholder="Select Type"
              allowClear
            />
          </Form.Item>
        </Col>

        {/* <Col lg={6} md={12} sm={12} xs={12}>
            <Form.Item name="event" noStyle>
              <Select
                className="w-100"
                size="large"
                placeholder="Select Events List"
              />
            </Form.Item>
          </Col> */}
      </Row>
    </Card>
  );
}
