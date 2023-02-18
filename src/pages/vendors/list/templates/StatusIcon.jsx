import React from "react";
import { Tooltip } from "antd";
import { find } from "lodash";

import { VENDOR_STATUSES } from "../../../../constants/app";

export default function StatusIcon({ status, ...rest }) {
  const statusObj = find(VENDOR_STATUSES, (obj) => obj.text === status);

  if (!statusObj) return;

  const Icon = statusObj.icon;
  return <Icon {...rest} />;
}
