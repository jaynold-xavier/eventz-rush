import React, { useEffect, useState } from "react";
import { Card, Collapse, Divider, Form, Spin } from "antd";
import Stripe from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { get, isEmpty, map, size, some } from "lodash";
import dayjs from "dayjs";

import { PaymentField } from "../../../../../../components/fields";
import {
  CLIENT_SECRET,
  stripePromise,
} from "../../../../../../assets/js/stripe";
import { formatAsCurrency } from "../../../../../../helpers/number";
import { Header } from "antd/es/layout/layout";
import {
  bookingPaymentPeriod,
  finalPaymentPeriod,
} from "../../../../../../constants/app";

const appearance = {
  theme: "stripe",
};

export default function PaymentStep(props) {
  return (
    <Form.Item name="payment">
      <PaymentSection {...props} />
    </Form.Item>
  );
}

function PaymentContent({ amount, value, onChange }) {
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    let isCancel = false;
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async (isCancel) => {
      if (isCancel) return;

      // Create a PaymentIntent with the order amount and currency
      const stripeElem = new Stripe(CLIENT_SECRET);
      const paymentIntent = await stripeElem.paymentIntents.create({
        amount,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      setClientSecret(paymentIntent.client_secret);
    };

    createPaymentIntent(isCancel);

    return () => {
      isCancel = true;
    };
  }, [amount]);

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) return <Spin spinning={true} />;

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentField
        value={value}
        onChange={onChange}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

function PaymentSection({ value, onChange, vendors, eventCreatedOn }) {
  let bookingPaymentDueDate;
  let finalPaymentDueDate;
  if (eventCreatedOn) {
    const bookingPaymentParts = bookingPaymentPeriod.split(" ");
    bookingPaymentDueDate = eventCreatedOn
      .clone()
      .add(bookingPaymentParts[0], bookingPaymentParts[1]);

    const finalPaymentParts = finalPaymentPeriod.split(" ");
    finalPaymentDueDate = eventCreatedOn
      .clone()
      .add(finalPaymentParts[0], finalPaymentParts[1]);
  }

  const netAmount = map(vendors, (v) => v.amount).reduce(
    (prev, curr) => prev + curr,
    0
  );

  let bookingPaymentAmt;
  let finalPaymentAmt;
  if (netAmount) {
    bookingPaymentAmt = netAmount / 2;
    finalPaymentAmt = netAmount / 2;
  }

  const contentList = {
    bookingPayment: (
      <PaymentContent
        amount={bookingPaymentAmt}
        value={value}
        onChange={onChange}
      />
    ),
    finalPayment: (
      <PaymentContent
        amount={finalPaymentAmt}
        value={value}
        onChange={onChange}
      />
    ),
  };

  if (isEmpty(vendors)) return null;

  return (
    <>
      <Card className="w-100" title="Payment Summary">
        <div className="d-flex justify-content-between">
          <div>{`${size(vendors)} Vendors`}</div>
          <div>{formatAsCurrency(netAmount)}</div>
        </div>

        <Divider />

        <div className="d-flex justify-content-between">
          <div>Total Amount</div>
          <div>{formatAsCurrency(netAmount)}</div>
        </div>
      </Card>

      <Collapse expandIconPosition="right" accordion>
        <Collapse.Panel
          header={
            <PaymentHeader title="Booking" dueDate={bookingPaymentDueDate} />
          }
        >
          {contentList.bookingPayment}
        </Collapse.Panel>

        <Collapse.Panel
          header={<PaymentHeader title="Final" />}
          dueDate={finalPaymentDueDate}
        >
          {contentList.finalPayment}
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

function PaymentHeader({ title, dueDate, amount }) {
  return (
    <Header
      prefixCls="payment-header"
      className="d-flex justify-content-between"
    >
      <div>
        <h6>{title}</h6>
        <div className="font-12 text-uppercase">Payment</div>
      </div>

      <div>
        <h6>{formatAsCurrency(amount)}</h6>
        {dueDate && (
          <div className="font-12 text-uppercase">
            Due on {dueDate.format()}
          </div>
        )}
      </div>
    </Header>
  );
}
