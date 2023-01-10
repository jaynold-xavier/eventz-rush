import { PhoneFilled, MailFilled, InfoCircleOutlined } from "@ant-design/icons";
import React from "react";
import {
  Avatar,
  Button,
  Card,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { VendorStatusIcon } from "../../../components/icons";
import appTheme from "../../../assets/js/theme";

const avatarProps = {
  shape: "circle",
  size: { xs: 80, sm: 80, md: 90, lg: 90, xl: 100, xxl: 100 },
};

export default function ListItem({ data, loading, ...rest }) {
  const { id, email, title, type, description, phone, profilePicUrl } = data;

  const descriptionRender = (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  );

  return (
    <List.Item className="vendors-list-item pl-0 pr-0" {...rest}>
      <Card
        actions={[
          <Button className="rounded-0" size="large" type="primary" block>
            Explore Me
          </Button>,
        ]}
      >
        <Content className="vendor-item-content text-center">
          <Skeleton
            avatar={avatarProps}
            title={false}
            paragraph={false}
            loading={loading}
            active
          >
            <div className="d-inline-block position-relative">
              <Avatar
                className="vendor-item-avatar"
                src={profilePicUrl}
                {...avatarProps}
              />

              <VendorStatusIcon
                className="position-absolute font-24"
                status="Available"
                style={{ top: 0, right: 0 }}
              />
            </div>
          </Skeleton>

          <Skeleton paragraph={{ rows: 1 }} loading={loading} active>
            <Typography.Title className="text-uppercase mb-0 mt-1" level={5}>
              {title}
            </Typography.Title>

            <Tag className="text-uppercase font-12 mr-0 mt-1" color="geekblue">
              {type}
            </Tag>
          </Skeleton>
        </Content>

        <div className="shape-divider">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 0L0 0 598.97 114.72 1200 0z"
              className="shape-fill"
            />
          </svg>
        </div>

        <Content className="vendor-item-content text-left">
          <Skeleton title loading={loading} active>
            <Space>
              <PhoneFilled
                className="font-14"
                style={{ color: appTheme.colorPrimary }}
              />
              <strong>Phone</strong>
            </Space>
            <div className="text-grey font-14">{phone}</div>

            <Space className="mt-3">
              <MailFilled
                className="font-14"
                style={{ color: appTheme.colorPrimary }}
              />
              <strong>Email</strong>
            </Space>

            <Typography.Text
              className="d-block"
              ellipsis={{ tooltip: email }}
              style={{ maxWidth: 250 }}
            >
              <a href={`mailto:${email}`} className="font-14">
                {email}
              </a>
            </Typography.Text>

            <Space className="mt-3">
              <InfoCircleOutlined
                className="font-14"
                style={{ color: appTheme.colorPrimary }}
              />
              <strong>About</strong>
            </Space>
            <Typography.Paragraph
              className="vendor-item-description"
              ellipsis={{ rows: 3, tooltip: descriptionRender }}
            >
              {descriptionRender}
            </Typography.Paragraph>
          </Skeleton>
        </Content>
      </Card>
    </List.Item>
  );
}
