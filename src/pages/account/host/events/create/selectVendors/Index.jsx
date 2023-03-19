import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
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
  Space,
  Spin,
  Tooltip,
} from "antd";
import { where } from "firebase/firestore";
import { find, get, isEmpty, map, remove, size, some } from "lodash";

import { SearchInput } from "../../../../../../components/fields";
import {
  commonPopConfirmProp,
  USER_ROLES,
} from "../../../../../../constants/app";
import { vendorTypesOptions } from "../../../../../../constants/dropdown";
import {
  getAvailableVendors,
  getInvitees,
  addInvitee,
  unInviteVendor,
  updateInvitee,
} from "../../../../../../services/database";
import VendorItem from "../../../../../vendors/list/item/Index";
import SelectServicesDrawer from "./selectServices/Index";
import { INVITE_STATUSES } from "../../../../../../constants/app";
import { appTheme } from "../../../../../../assets/js/theme";
import { formatAsCurrency } from "../../../../../../helpers/number.js";

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

  useEffect(() => {
    let isCancel = false;

    setInvitees(isCancel);

    async function setInvitees(isCancel) {
      if (isCancel || !eventId) return;

      try {
        const data = await getInvitees(eventId);
        console.log({ eventId, data });

        form.setFieldValue("vendors", data);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      isCancel = true;
    };
  }, [eventId, form]);

  const openSelectServicesDrawer = (data) => {
    selectedVendorRef.current = data;
    setShowSelectServicesDrawer(true);
  };

  const netAmount = map(form.getFieldValue("vendors"), (v) => v.amount).reduce(
    (prev, curr) => prev + curr,
    0
  );

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

              if (
                some(value, (v) => v.status === INVITE_STATUSES.pending.text)
              ) {
                message.error(
                  "All the vendors have not yet accepted your invite"
                );
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
            vendorInfo: selectedVendorRef.current,
            open: showSelectServicesDrawer,
            onClose: (e) => setShowSelectServicesDrawer((s) => !s),
          }}
        />
      </Form.Item>

      <Space className="selected-vendors" align="end">
        <div>
          <div className="font-12 text-uppercase">Selected Vendors</div>

          <Avatar.Group
            maxStyle={{
              color: appTheme.colorPrimary,
              backgroundColor: "#fde3cf",
            }}
          >
            {map(form.getFieldValue("vendors"), (v) => {
              const vendor = find(dataSource, (d) => d.email === v.inviteeId);
              const statusInfo = find(
                INVITE_STATUSES,
                (val, key) => key === get(v, "status")
              );

              if (!vendor) return null;
              return (
                <Tooltip
                  title={
                    <>
                      <div>{vendor.title}</div>
                      <div
                        className="font-12"
                        style={{ color: get(statusInfo, "color") }}
                      >
                        {vendor.status}
                      </div>
                    </>
                  }
                >
                  <Avatar
                    src={vendor.photoUrl}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: appTheme.colorPrimary }}
                  >
                    {vendor.title}
                  </Avatar>
                </Tooltip>
              );
            })}
          </Avatar.Group>
        </div>

        {netAmount && <h5>{formatAsCurrency(netAmount)}</h5>}
      </Space>
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
  const invite = async (data) => {
    if (!data) return;

    const inviteeInfo = {
      eventId,
      inviteeId: data.inviteeId,
      services: data.services,
      amount: data.amount,
      status: INVITE_STATUSES.pending.text,
      type: USER_ROLES.vendor.text,
    };

    const currentData = value || [];
    const existing = currentData.find((v) => v.inviteeId === data.inviteeId);
    if (existing) {
      await updateInvitee(eventId, data.inviteeId, inviteeInfo);
      Object.assign(existing, inviteeInfo);
    } else {
      await addInvitee(inviteeInfo);
      currentData.push(inviteeInfo);
    }
    onChange([...currentData]);
  };

  const requestServices = async (data) => {
    await invite(data);

    message.success("Services requested! Vendor will be in touch.");
  };

  const saveSelectedServices = async (data) => {
    await invite(data);
  };

  const unselectVendor = async (inviteeId) => {
    if (!inviteeId) return;

    await unInviteVendor(eventId, inviteeId);

    const currentData = value || [];
    remove(currentData, (v) => v.inviteeId === inviteeId);
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
          sm: 1,
          md: 1,
          lg: 2,
          xl: 3,
          xxl: 4,
          column: 3,
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

    const inviteInfo = find(value, (v) => v.inviteeId === item.email);
    const selected = !!inviteInfo;

    const hasServices = !isEmpty(get(item, "services"));
    if (hasServices) {
      actions.push(
        <Button
          className="rounded-0"
          size="large"
          type="primary"
          onClick={(e) => {
            onSelectServices({
              ...item,
              selectedServices: get(inviteInfo, "services"),
            });
          }}
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
            return unselectVendor(item.email);
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

    let inviteStatus = get(inviteInfo, "status");
    if (inviteStatus) {
      if (!hasServices) {
        inviteStatus = "Awaiting Info !";
      } else if (inviteStatus === INVITE_STATUSES.pending.text) {
        inviteStatus = "Invite pending !";
      } else if (inviteStatus === INVITE_STATUSES.accepted.text) {
        inviteStatus = "Invite accepted !";
      } else if (inviteStatus === INVITE_STATUSES.declined.text) {
        inviteStatus = "Invite declined !";
      }
    }

    return (
      <VendorItem
        data={item}
        selected={selected}
        actions={actions}
        inviteStatus={inviteStatus}
      />
    );
  }
}
