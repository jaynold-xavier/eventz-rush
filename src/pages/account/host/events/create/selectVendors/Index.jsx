import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ConfigProvider,
  Empty,
  Form,
  List,
  Row,
  Select,
  Spin,
  Tooltip,
} from "antd";
import { where } from "firebase/firestore";
import { get, some } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../../../../../../components/fields/search/Index";

import { vendorTypesOptions } from "../../../../../../constants/dropdown";
import { getAvailableVendors } from "../../../../../../services/database";
import VendorItem from "../../../../../vendors/list/item/Index";
import SelectServicesDrawer from "./selectServices/Index";

const initFilters = {
  q: "",
  type: "",
};

const constructConstraints = (filters = initFilters) => {
  const { q, type } = filters;
  const constraints = [];

  if (q) {
    constraints.push(where("title", "==", q));
    constraints.push(where("userName", "==", q));
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
  const [showSelectServicesDrawer, setShowSelectServicesDrawer] =
    useState(false);

  const selectedVendorRef = useRef();

  useEffect(() => {
    let isCancel = false;

    fetchDataSource(isCancel);

    async function fetchDataSource(isCancel) {
      if (isCancel) return;

      try {
        setLoading(true);
        const dateRange = form.getFieldValue("date");
        const fromDate = get(dateRange, "0");
        const toDate = get(dateRange, "1");
        const constraints = constructConstraints(filters);

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

  const openSelectServicesDrawer = (data) => {
    selectedVendorRef.current = data;
    setShowSelectServicesDrawer(true);
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        <Col span={18}>
          <SearchInput
            className="w-100"
            placeholder="Search Vendors"
            size="large"
            onChange={(value) => setFilters((s) => ({ ...s, q: value }))}
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
        <VendorsList
          dataSource={dataSource}
          onSelectServices={openSelectServicesDrawer}
          selectServicesLayoutProps={{
            data: selectedVendorRef.current,
            visible: showSelectServicesDrawer,
            onClose: (e) => setShowSelectServicesDrawer((s) => !s),
          }}
        />
      </Form.Item>
    </Spin>
  );
}

function VendorsList({
  dataSource,
  value,
  onChange,
  onSelectServices,
  selectServicesLayoutProps = {},
}) {
  const saveSelectedServices = async (data) => {
    if (!data) return;

    const currentData = value || [];
    currentData.push(data);
    onChange(currentData);
  };

  return (
    <>
      <List
        className="vendors-list selectable-list"
        dataSource={dataSource}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 5,
          xl: 5,
          xxl: 5,
        }}
        renderItem={renderItem}
        locale={{ emptyText: <Empty description="No Vendors available" /> }}
      />

      <SelectServicesDrawer
        {...selectServicesLayoutProps}
        onSave={saveSelectedServices}
      />
    </>
  );

  function renderItem(item) {
    const selected = some(value, (v) => v.id === item.id);
    const actions = [
      <Button
        className="rounded-0"
        size="large"
        type="primary"
        onClick={(e) => onSelectServices(item)}
        block
      >
        Select Services
      </Button>,
    ];

    if (selected) {
      actions.push(
        <Tooltip title="Withdraw Invite">
          <Button
            className="rounded-0"
            size="large"
            type="primary"
            icon={<CloseOutlined />}
            danger
          />
        </Tooltip>
      );
    }

    return <VendorItem data={item} selected={selected} actions={actions} />;
  }
}
