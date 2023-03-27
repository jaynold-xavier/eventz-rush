import React from "react";
import { Collapse, Layout } from "antd";

import { HomePageHeader } from "../../components/page/index";

const { Content } = Layout;

export default function Privacy() {
  return (
    <Layout className="policy-layout">
      <HomePageHeader className="policy-header" title="Privacy & Legal" />

      <Content prefixCls="page-content" className="policy-content">
        <div className="container">
          <h4>Booking Policy</h4>
          <p className="mt-3">
            Booking can only be created 30 days before the start of the event.
            Events cannot be booked over other bookings unless they are closed
            or cancelled.
          </p>

          <br />
          <br />

          <h4>Payment Policy</h4>
          <p className="mt-3">
            Payments are settled in two installments: a booking payment and the
            final payment. Each installment amounts to 50% of the total amount.
            <br />
            <br />
            The booking payment must be paid within 2 days after the creation of
            the event. The final payment must be paid 2 weeks before the start
            of the event.
          </p>

          <br />
          <br />

          <h4>Cancelation Policy</h4>
          <p className="mt-3">
            Events booked can be cancelled before the start of the event.
            Cancelled events are not subject to refunds.
          </p>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Content>
    </Layout>
  );
}
