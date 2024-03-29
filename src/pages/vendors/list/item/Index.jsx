import {
  PhoneFilled,
  MailFilled,
  InfoCircleOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import React from "react";
import {
  Avatar,
  Card,
  List,
  Rate,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { get } from "lodash";

import { appTheme } from "../../../../assets/js/theme";
import { getDisplayName } from "../../../../helpers/auth";
import { VENDOR_TYPES } from "../../../../constants/app";

const avatarProps = {
  shape: "circle",
  size: { xs: 80, sm: 80, md: 90, lg: 90, xl: 100, xxl: 100 },
};

export default function ListItem({
  data,
  loading = false,
  selected = false,
  inviteStatus,
  ...rest
}) {
  const { email, type, description, phoneNumber, photoURL, ratings } = data;

  const descriptionRender = (
    <div dangerouslySetInnerHTML={{ __html: description || "—" }} />
  );

  const showContactInfo = get(data, "configurations.showContactInfo");

  const classNames = ["vendors-list-item pl-0 pr-0"];
  if (selected) {
    classNames.push("selected");
  }

  return (
    <List.Item className={classNames.join(" ")}>
      <Card {...rest}>
        <div className="vendor-item-content text-center">
          <Skeleton
            avatar={avatarProps}
            title={false}
            paragraph={false}
            loading={loading}
            active
          >
            <div className="d-inline-block position-relative">
              <Avatar
                className="user-avatar"
                src={selected ? undefined : photoURL}
                {...avatarProps}
                icon={selected ? <CheckOutlined /> : <UserOutlined />}
              />
            </div>
          </Skeleton>

          <Skeleton paragraph={{ rows: 1 }} loading={loading} active>
            <Typography.Title className="mb-0 mt-1" level={5}>
              {getDisplayName(data)}
            </Typography.Title>

            <Tag className="text-uppercase font-12 mr-0 mt-1" color="geekblue">
              {get(VENDOR_TYPES[type], "text", type)}
            </Tag>
          </Skeleton>
        </div>

        {selected && (
          <div className="font-14 text-center text-red text-uppercase">
            {inviteStatus}
          </div>
        )}

        {!!ratings && (
          <div className="text-center">
            <Rate value={ratings} allowClear={false} disabled />
          </div>
        )}

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

        <div className="vendor-item-content text-left font-14">
          <Skeleton title loading={loading} active>
            <Space>
              <InfoCircleOutlined
                className="font-14"
                style={{ color: appTheme.colorPrimary }}
              />
              <strong className="font-14">About</strong>
            </Space>
            <Typography.Paragraph
              className="font-16"
              ellipsis={{
                rows: 3,
                tooltip: {
                  title: descriptionRender,
                  autoAdjustOverflow: true,
                  arrowPointAtCenter: true,
                },
              }}
            >
              {descriptionRender}
            </Typography.Paragraph>

            {showContactInfo && (
              <>
                <Space>
                  <PhoneFilled
                    className="font-14"
                    style={{ color: appTheme.colorPrimary }}
                  />
                  <strong className="font-14">Phone</strong>
                </Space>
                <div className="font-16">{phoneNumber || "—"}</div>
              </>
            )}

            <Space className="mt-3">
              <MailFilled
                className="font-14"
                style={{ color: appTheme.colorPrimary }}
              />
              <strong className="font-14">Email</strong>
            </Space>

            <Typography.Text
              className="d-block font-14"
              ellipsis={{ tooltip: email }}
              // style={{ maxWidth: 250 }}
            >
              <a className="font-16" href={`mailto:${email}`}>
                {email}
              </a>
            </Typography.Text>
          </Skeleton>
        </div>
      </Card>
    </List.Item>
  );
}
