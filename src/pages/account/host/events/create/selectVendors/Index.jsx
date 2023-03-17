import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Empty,
  Form,
  List,
  message,
  Popconfirm,
  Row,
  Select,
  Spin,
  Tooltip,
} from "antd";
import { where } from "firebase/firestore";
import { find, get, isEmpty, reduce, remove, size, some } from "lodash";

import { SearchInput } from "../../../../../../components/fields";
import {
  commonPopConfirmProp,
  USER_ROLES,
} from "../../../../../../constants/app";
import { vendorTypesOptions } from "../../../../../../constants/dropdown";
import {
  getAvailableVendors,
  inviteVendor,
  unInviteVendor,
} from "../../../../../../services/database";
import VendorItem from "../../../../../vendors/list/item/Index";
import SelectServicesDrawer from "./selectServices/Index";
import { INVITE_STATUSES } from "../../../../../../constants/app";

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

export default function SelectVendorsStep({ form, eventId }) {
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

        const data = await getAvailableVendors(
          fromDate,
          toDate,
          eventId,
          constraints
        );
        setDataSource(data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [filters, eventId, form]);

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

      <Form.Item
        name="vendors"
        rules={[
          {
            validator: (rule, value) => {
              if (size(value) < 1) {
                message.error("Please select at least one vendor");
                return Promise.reject();
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <VendorsList
          eventId={eventId}
          dataSource={dataSource}
          onSelectServices={openSelectServicesDrawer}
          selectServicesLayoutProps={{
            data: selectedVendorRef.current,
            open: showSelectServicesDrawer,
            onClose: (e) => setShowSelectServicesDrawer((s) => !s),
          }}
        />
      </Form.Item>
    </Spin>
  );
}

function VendorsList({
  eventId,
  dataSource,
  value,
  onChange,
  onSelectServices,
  selectServicesLayoutProps = {},
}) {
  const requestServices = async (data) => {
    if (!data) return;

    const inviteeId = await inviteVendor({
      eventId,
      inviteeId: data.email,
      status: INVITE_STATUSES.pending.text,
      type: USER_ROLES.vendor.text,
    });

    data.inviteeId = inviteeId;

    const currentData = value || [];
    currentData.push(data);
    onChange([...currentData]);

    message.success("Services requested! Vendor will be in touch.");
  };

  const saveSelectedServices = async (data) => {
    if (!data) return;

    const inviteeId = await inviteVendor({
      eventId,
      inviteeId: data.email,
      services: data.services,
      amount: reduce(
        data.services,
        (prev = 0, curr = 0) => prev.price + curr.price
      ),
      status: INVITE_STATUSES.pending.text,
      type: USER_ROLES.vendor.text,
    });

    data.inviteeId = inviteeId;

    const currentData = value || [];
    currentData.push(data);
    onChange(currentData);
  };

  const unselectVendor = async (inviteeId) => {
    if (!inviteeId) return;

    await unInviteVendor(inviteeId);

    const currentData = value || [];
    remove(currentData, (data) => data.inviteeId === inviteeId);
    onChange([...currentData]);
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
    const actions = [];

    const selected = some(value, (v) => v.email === item.email);
    const hasServices = !isEmpty(get(item, "services"));
    if (hasServices) {
      actions.push(
        <Button
          className="rounded-0"
          size="large"
          type="primary"
          onClick={(e) => onSelectServices(item)}
          block
        >
          Select Services
        </Button>
      );
    } else {
      actions.push(
        <Popconfirm
          title="Are you sure you want to request services from this vendor?"
          onConfirm={(e) => requestServices(item)}
          disabled={selected}
          {...commonPopConfirmProp}
        >
          <Button
            className="rounded-0"
            size="large"
            type="primary"
            disabled={selected}
            block
          >
            Request Services
          </Button>
        </Popconfirm>
      );
    }

    if (selected) {
      actions.push(
        <Popconfirm
          title="Are you sure you want to withdraw invite from this vendor?"
          onConfirm={(e) => {
            const vendor = find(value, (v) => v.email === item.email);
            if (vendor) {
              return unselectVendor(vendor.inviteeId);
            }
          }}
          {...commonPopConfirmProp}
        >
          <Tooltip title="Withdraw Invite">
            <Button
              className="rounded-0"
              size="large"
              type="primary"
              icon={<CloseOutlined />}
              danger
            />
          </Tooltip>
        </Popconfirm>
      );
    }

    return <VendorItem data={item} selected={selected} actions={actions} />;
  }
}
