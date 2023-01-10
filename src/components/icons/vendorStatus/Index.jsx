import { CheckCircleTwoTone, StopTwoTone } from "@ant-design/icons";
import React from "react";
import { Tooltip } from "antd";
import { find } from "lodash";

import { VENDOR_STATUSES } from "../../../constants/app";

export default function VendorStatusIcon({ status, ...rest }) {
  const statusObj = find(VENDOR_STATUSES, (obj) => obj.text === status);

  if (!statusObj) return;

  return (
    <Tooltip title={statusObj.text}>
      {status === statusObj.text ? (
        <CheckCircleTwoTone
          className="font-24"
          twoToneColor={statusObj.color}
          {...rest}
        />
      ) : (
        <StopTwoTone
          className="font-24"
          twoToneColor={statusObj.color}
          {...rest}
        />
      )}
    </Tooltip>
  );
}
