import { UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Drawer,
  Empty,
  Space,
  Tag,
  Typography,
} from "antd";
import { get, isEmpty } from "lodash";
import React from "react";

import { VENDOR_TYPES } from "../../../../../../../constants/app";

import { getDisplayName } from "../../../../../../../helpers/auth";

const avatarProps = {
  shape: "circle",
  size: { xs: 60, sm: 60, md: 70, lg: 70, xl: 80, xxl: 80 },
};

export default function SelectServicesDrawer({
  data,
  requestedServices = [],
  onSave,
  ...rest
}) {
  const { type, photoURL } = data || {};

  const services = isEmpty(get(data, "services"))
    ? requestedServices
    : get(data, "services");

  const save = async () => {
    await onSave();
    rest.onClose();
  };

  return (
    <Drawer
      className="select-services-layout"
      width={600}
      title={"Select Services"}
      footer={
        isEmpty(services) ? (
          <Button type="primary" onClick={save} block>
            Request Services
          </Button>
        ) : (
          <Button type="primary" onClick={save} block>
            Select Services and Invite Vendor
          </Button>
        )
      }
      {...rest}
    >
      <Space>
        <Avatar
          className="user-avatar"
          src={photoURL}
          {...avatarProps}
          icon={<UserOutlined />}
        />

        <div>
          <Typography.Title level={5}>{getDisplayName(data)}</Typography.Title>

          <Tag className="text-uppercase font-12" color="geekblue">
            {get(VENDOR_TYPES[type], "text", type)}
          </Tag>
        </div>
      </Space>

      <Divider />

      {isEmpty(services) && (
        <Alert
          type="warning"
          message="The vendor has either hidden their services or has not yet made it
          available. Please contact the vendor to make it available here."
        />
      )}
    </Drawer>
  );
}
