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

import { VENDOR_TYPES } from "../../../constants/app";
import { getDisplayName } from "../../../helpers/auth";
import { formatAsCurrency } from "../../../helpers/number";

const avatarProps = {
  shape: "circle",
  size: { xs: 60, sm: 60, md: 70, lg: 70, xl: 80, xxl: 80 },
};

export default function SelectServicesDrawer({
  vendorInfo,
  requestedServices = [],
  onSave,
  ...rest
}) {
  const [selectedServices, setSelectedServices] = useState([]);

  const { type, photoURL } = vendorInfo || {};

  const services = isEmpty(get(vendorInfo, "services"))
    ? requestedServices
    : get(vendorInfo, "services");

  const save = async () => {
    const prices = selectedServices.map((id) => {
      const service = services.find((s) => s.id === id);
      return service.amount;
    });

    await onSave({
      inviteeId: vendorInfo.email,
      services: selectedServices,
      amount: prices.reduce((prev = 0, curr = 0) => prev + curr),
    });

    message.success("Services selected and Vendor notified!");
    rest.onClose();
  };

  return (
    <Drawer
      className="select-services-layout"
      title={"Select Services"}
      afterOpenChange={(open) => {
        if (open) {
          setSelectedServices(get(vendorInfo, "selectedServices"));
        }
      }}
      footer={
        <Button type="primary" onClick={save} block>
          Save and Notify Vendor
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
          <Typography.Title level={5}>
            {getDisplayName(vendorInfo)}
          </Typography.Title>

          <Tag className="text-uppercase font-12" color="geekblue">
            {get(VENDOR_TYPES[type], "text", type)}
          </Tag>
        </div>
      </Space>

      <Divider />

      <p>Please select the services you require from this vendor.</p>

      {isEmpty(services) ? (
        <Empty description="No services available" />
      ) : (
        <Checkbox.Group
          className="services-selection-list w-100"
          value={selectedServices}
          onChange={setSelectedServices}
        >
          {map(services, (s) => {
            return (
              <Checkbox key={s.id} className="w-100" value={s.id}>
                <Space className="w-100 justify-content-between">
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
