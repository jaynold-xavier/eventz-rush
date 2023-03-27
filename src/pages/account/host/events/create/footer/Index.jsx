import React from "react";
import { Space, Button, Layout } from "antd";
import { isEmpty } from "lodash";

import { formatAsCurrency } from "../../../../../../helpers/number";
import InviteesGroup from "../../../../../../components/avatar/invitees/Index";

const { Footer } = Layout;

export default function EventWizardFooter({
  invitees,
  vendors,
  netAmount,
  disableSave,
  disablePrev,
  loading,
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

            <InviteesGroup
              className="ml-auto mr-auto"
              value={invitees}
              vendors={vendors}
            />
          </div>

          {!!netAmount && <h5>{formatAsCurrency(netAmount)}</h5>}
        </Space>
      )}

      <Space className="ml-auto" size={12}>
        {!disablePrev && (
          <Button type="primary" size="large" onClick={onPrev}>
            Prev
          </Button>
        )}

        <Button
          type="primary"
          size="large"
          onClick={onSave}
          disabled={disableSave}
          loading={loading}
        >
          Save and Continue
        </Button>

        <Button size="large" onClick={onCancel}>
          Cancel
        </Button>
      </Space>
    </Footer>
  );
}
