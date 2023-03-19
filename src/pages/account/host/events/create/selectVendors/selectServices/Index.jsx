import { UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Empty,
  message,
  Space,
  Tag,
  Typography,
} from "antd";
import { get, isEmpty, map } from "lodash";

import { VENDOR_TYPES } from "../../../../../../../constants/app";
import { getDisplayName } from "../../../../../../../helpers/auth";
import { formatAsCurrency } from "../../../../../../../helpers/number";

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
  const [selectedServices, setSelectedServices] = useState([]);

  const { type, photoURL } = data || {};

  const services = isEmpty(get(data, "services"))
    ? requestedServices
    : get(data, "services");

  const save = async () => {
    await onSave({
      email: data.email,
      services: selectedServices,
    });
    message.success("Services selected and Invite sent!");
    rest.onClose();
  };

  return (
    <Drawer
      className="select-services-layout"
      width={600}
      title={"Select Services"}
      footer={
        <Button type="primary" onClick={save} block>
          Select Services and Invite Vendor
        </Button>
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

      <h6>Services</h6>
      <p>Please select the services you require from this vendor.</p>

      {isEmpty(services) ? (
        <Empty description="No services available" />
      ) : (
        <Checkbox.Group className="w-100" onChange={setSelectedServices}>
          {map(services, (s) => {
            return (
              <Checkbox key={s.id} className="w-100" value={s.id}>
                <Space className="justify-content-between">
                  <div dangerouslySetInnerHTML={{ __html: s.description }} />
                  <strong>{formatAsCurrency(s.amount)}</strong>
                </Space>
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      )}
    </Drawer>
  );
}
