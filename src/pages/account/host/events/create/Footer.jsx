import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar, Space, Tooltip, Button, Layout } from "antd";
import { map, find, get, isEmpty } from "lodash";

import { appTheme } from "../../../../../assets/js/theme";
import { formatAsCurrency } from "../../../../../helpers/number";
import { INVITE_STATUSES } from "../../../../../constants/app";

const { Footer } = Layout;

export default function EventWizardFooter({
  invitees,
  vendors,
  netAmount,
  disableSave,
  disablePrev,
  onPrev,
  onSave,
  onCancel,
}) {
  return (
    <Footer
      prefixCls="event-create-footer"
      className="d-flex justify-content-between flex-wrap"
    >
      {!isEmpty(invitees) && (
        <Space align="end" size={30}>
          <div>
            <div className="font-12 text-uppercase">Selected Vendors</div>

            <Avatar.Group
              maxStyle={{
                color: appTheme.colorPrimary,
                backgroundColor: "#fde3cf",
              }}
              maxCount={5}
            >
              {map(invitees, (i) => {
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
                      <>
                        <div>{vendor.title}</div>
                        <div
                          className="font-12"
                          style={{ color: get(statusInfo, "color") }}
                        >
                          {i.status}
                        </div>
                      </>
                    }
                  >
                    <Avatar
                      src={vendor.photoUrl}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: appTheme.colorPrimary }}
                    >
                      {vendor.title}
                    </Avatar>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </div>

          {!!netAmount && <h5>{formatAsCurrency(netAmount)}</h5>}
        </Space>
      )}

      <Space className="ml-auto" size={12}>
        <Button
          type="primary"
          size="large"
          onClick={onPrev}
          disabled={disablePrev}
        >
          Prev
        </Button>

        <Button
          type="primary"
          size="large"
          onClick={onSave}
          disabled={disableSave}
        >
          Save and Continue
        </Button>

        <Button size="large" onClick={onCancel}>
          Exit
        </Button>
      </Space>
    </Footer>
  );
}
