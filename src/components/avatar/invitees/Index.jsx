import {
  UserOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import React from "react";
import { Avatar, Badge, Space, Tooltip } from "antd";
import { find, get, map } from "lodash";

import { appTheme } from "../../../assets/js/theme";
import { INVITE_STATUSES } from "../../../constants/app";
import { formatAsCurrency } from "../../../helpers/number";

const statusBadge = {
  [INVITE_STATUSES.pending.text]: (
    <InfoCircleTwoTone
      className="font-12"
      twoToneColor={INVITE_STATUSES.pending.color}
    />
  ),
  [INVITE_STATUSES.accepted.text]: (
    <CheckCircleTwoTone
      className="font-12"
      twoToneColor={INVITE_STATUSES.accepted.color}
    />
  ),
  [INVITE_STATUSES.declined.text]: (
    <CloseCircleTwoTone
      className="font-12"
      twoToneColor={INVITE_STATUSES.declined.color}
    />
  ),
};

export default function InviteesGroup({ value, vendors, ...rest }) {
  return (
    <Avatar.Group
      maxStyle={{
        color: appTheme.colorPrimary,
        backgroundColor: "#fde3cf",
      }}
      maxCount={5}
      {...rest}
    >
      {map(value, (i) => {
        const vendor = find(vendors, (d) => d.email === i.inviteeId);
        const statusInfo = find(
          INVITE_STATUSES,
          (val) => val.text === i.status
        );

        if (!vendor) return null;
        return (
          <Tooltip
            key={vendor.email}
            title={
              <TooltipTitle
                title={vendor.title}
                statusColor={statusInfo.color}
                status={statusInfo.text}
                amount={i.amount}
              />
            }
          >
            <Badge
              count={statusBadge[get(statusInfo, "text")]}
              offset={[-5, 5]}
            >
              <Avatar
                src={vendor.photoUrl || undefined}
                icon={<UserOutlined />}
                style={{ backgroundColor: appTheme.colorPrimary }}
              >
                {vendor.title}
              </Avatar>
            </Badge>
          </Tooltip>
        );
      })}
    </Avatar.Group>
  );
}

function TooltipTitle({ title, status, statusColor, amount }) {
  const hasAccepted = status === INVITE_STATUSES.accepted.text;

  return (
    <>
      <div>{title}</div>

      <Space size={20}>
        {status && (
          <div className="font-12" style={{ color: statusColor }}>
            {status}
          </div>
        )}

        {amount && hasAccepted && (
          <div className="font-12 text-right" style={{ color: statusColor }}>
            {formatAsCurrency(amount)}
          </div>
        )}
      </Space>
    </>
  );
}
