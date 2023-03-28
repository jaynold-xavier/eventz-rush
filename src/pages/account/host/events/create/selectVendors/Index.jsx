import { CloseOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
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
  Tooltip,
} from "antd";
import { every, find, get, isEmpty, remove, size, some } from "lodash";

import { SearchInput } from "../../../../../../components/fields";
import {
  commonPopConfirmProp,
  USER_ROLES,
} from "../../../../../../constants/app";
import { vendorTypesOptions } from "../../../../../../constants/dropdown";
import {
  addInvitee,
  unInviteVendor,
  updateInvitee,
} from "../../../../../../services/database";
import VendorItem from "../../../../../vendors/list/item/Index";
import { SelectServicesLayout as SelectServicesDrawer } from "../../../../../vendors";
import { INVITE_STATUSES } from "../../../../../../constants/app";

export default function SelectVendorsStep({ eventId, dataSource, setFilters }) {
  const [showSelectServices, setShowSelectServices] = useState(false);

  const selectedVendorRef = useRef();

  const openSelectServicesDrawer = (data) => {
    selectedVendorRef.current = data;

    setShowSelectServices(true);
  };

  return (
    <>
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
              allowClear
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

              const hasAllDeclinedVendors = every(
                value,
                (v) => v.status === INVITE_STATUSES.declined.text
              );
              if (hasAllDeclinedVendors) {
                message.error(
                  "All selected vendors have declined. Please select another vendor(s)"
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
            open: showSelectServices,
            onClose: (e) => setShowSelectServices((s) => !s),
          }}
        />
      </Form.Item>
    </>
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
      inviteeId: data.inviteeId || data.email,
      status: INVITE_STATUSES.pending.text,
      type: USER_ROLES.vendor.text,
    };

    if (data.services) {
      inviteeInfo.services = data.services;
    }

    if (data.amount) {
      inviteeInfo.amount = data.amount;
    }

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
        selectable
      />
    </>
  );

  function renderItem(item) {
    const inviteInfo = find(value, (v) => v.inviteeId === item.email);
    let inviteStatus = get(inviteInfo, "status");
    const selected = !!inviteInfo;

    const actions = [];
    const showServices = get(item, "configurations.showServices");
    let notRequiresRequest;
    if (!inviteStatus || inviteStatus === INVITE_STATUSES.pending.text) {
      notRequiresRequest = showServices && !isEmpty(get(item, "services"));
    } else {
      notRequiresRequest = true;
    }
    if (notRequiresRequest) {
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

    if (inviteStatus) {
      if (!notRequiresRequest) {
        inviteStatus = "Awaiting Info !";
      } else if (inviteStatus === INVITE_STATUSES.pending.text) {
        inviteStatus = "Invite pending !";
      } else if (inviteStatus === INVITE_STATUSES.accepted.text) {
        inviteStatus = "Invite accepted !";
        actions.length = 0;
      } else if (inviteStatus === INVITE_STATUSES.declined.text) {
        inviteStatus = "Invite declined !";
        actions.length = 0;
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
