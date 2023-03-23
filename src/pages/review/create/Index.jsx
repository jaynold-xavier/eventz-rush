import { UserOutlined } from "@ant-design/icons";
import React from "react";
import {
  Avatar,
  Divider,
  Form,
  Input,
  Modal,
  Rate,
  Space,
  Tag,
  Typography,
} from "antd";
import { get } from "lodash";

import { VENDOR_TYPES } from "../../../constants/app";
import { getDisplayName } from "../../../helpers/auth";

const avatarProps = {
  shape: "circle",
  size: { xs: 60, sm: 60, md: 70, lg: 70, xl: 80, xxl: 80 },
};

export default function CreateReviewLayout({
  vendorInfo,
  saveChanges,
  ...rest
}) {
  const [form] = Form.useForm();

  const { email, type, photoURL } = vendorInfo || {};

  const onSave = async (e) => {
    const data = await form.validateFields();
    await saveChanges({
      ...data,
      inviteeId: email,
    });

    rest.onCancel();
  };

  return (
    <Modal
      title="Review Vendor"
      className="create-review-layout"
      afterClose={(e) => {
        form.resetFields();
      }}
      okText="Save"
      cancelText="Cancel"
      onOk={onSave}
      width={500}
      style={{ maxWidth: 500 }}
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

      <Form
        form={form}
        layout="vertical"
        validateMessages={{ required: "${label} is required" }}
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
      >
        <Form.Item name="rating" label="Ratings" rules={[{ required: true }]}>
          <VendorRateField />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const VendorRateField = ({ value, onChange, ...rest }) => {
  return (
    <span>
      <Rate tooltips={desc} onChange={onChange} value={value} {...rest} />
      {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : null}
    </span>
  );
};
