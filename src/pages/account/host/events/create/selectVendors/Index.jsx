import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Empty,
  Form,
  Input,
  List,
  Row,
  Select,
  Spin,
  Tag,
} from "antd";
import { where } from "firebase/firestore";
import { get, startCase } from "lodash";
import React, { useEffect, useState } from "react";

import { vendorTypesOptions } from "../../../../../../constants/dropdown";
import { getDisplayName } from "../../../../../../helpers/auth";
import { getAvailableVendors } from "../../../../../../services/database";

const initFilters = {
  q: "",
  type: "",
};

const constructConstraints = (filters = initFilters) => {
  const { q, type } = filters;
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
    constraints.push(where("email", "==", q));
  }

  if (type) {
    constraints.push(where("type", "==", type));
  }

  return constraints;
};

export default function SelectVendorsStep({ form }) {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const constraints = constructConstraints(filters);
        const dateRange = form.getFieldValue("date");
        const fromDate = get(dateRange, "0");
        const toDate = get(dateRange, "0");
        console.log({ fromDate, toDate, dateRange, constraints, filters });
        const data = await getAvailableVendors(fromDate, toDate, constraints);
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [filters, form]);

  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <Input
            className="w-100"
            placeholder="Search Vendors"
            size="large"
            prefix={<SearchOutlined />}
            onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
          />
        </Col>

        <Col span={6}>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 20,
              },
            }}
          >
            <Select
              className="w-100"
              placeholder="Select Vendor Type"
              size="large"
              options={vendorTypesOptions}
              onChange={(value, option) =>
                setFilters((s) => ({ ...s, type: get(option, "label") }))
              }
            />
          </ConfigProvider>
        </Col>
      </Row>

      <br />

      <Form.Item name="vendors">
        <VendorsList dataSource={dataSource} />
      </Form.Item>
    </Spin>
  );
}

function VendorsList({ dataSource, value, onChange }) {
  return (
    <List
      className="available-vendors-list"
      itemLayout="vertical"
      dataSource={dataSource}
      renderItem={renderItem}
      locale={{ emptyText: <Empty description="No Vendors available" /> }}
    />
  );

  function renderItem(item, index) {
    const { email, type, phoneNumber } = item;
    return (
      <List.Item className="w-100 bg-white">
        <Row align="middle" justify="center">
          <Col span={10}>
            <List.Item.Meta
              title={getDisplayName(item)}
              description={
                <Tag
                  className="text-uppercase font-12 mr-0 mt-1"
                  color="geekblue"
                >
                  {startCase(type)}
                </Tag>
              }
            />
          </Col>

          <Col span={5}>
            <Row>
              <Col span={12}>Phone</Col>
              <Col span={12}>{phoneNumber || "-"}</Col>

              <Col span={12}>Email</Col>
              <Col span={12}>{email}</Col>
            </Row>
          </Col>

          <Col className="text-right" span={9}>
            <Button type="primary">More Details</Button>
          </Col>
        </Row>
      </List.Item>
    );
  }
}
