import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import React from "react";

import { appTheme } from "../../../assets/js/theme";

export default function UserAvatar({ title, src, ...rest }) {
  return (
    <Badge count={<UploadAvatar />}>
      <Avatar
        src={src || undefined}
        icon={<UserOutlined />}
        style={{ backgroundColor: appTheme.colorPrimary }}
        {...rest}
      >
        {title}
      </Avatar>
    </Badge>
  );
}

function UploadAvatar() {
  return <></>;
}
