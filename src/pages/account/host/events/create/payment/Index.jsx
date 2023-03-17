import React, { useEffect, useState } from "react";
import { Card, Form, Spin } from "antd";
import Stripe from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { get, some } from "lodash";
import dayjs from "dayjs";

import { PaymentField } from "../../../../../../components/fields";
import {
  CLIENT_SECRET,
  stripePromise,
} from "../../../../../../assets/js/stripe";

const appearance = {
  theme: "stripe",
};

export default function PaymentStep({ form, user, eventId, vendors }) {
  const firstPaymentInfo = {
    amount: 3000,
    dueDate: dayjs(),
  };

  const secondPaymentInfo = {
    amount: 5000,
    dueDate: dayjs(),
  };

  return (
    <Form.Item name="payment">
      <PaymentTabs
        firstPaymentInfo={firstPaymentInfo}
        secondPaymentInfo={secondPaymentInfo}
      />
    </Form.Item>
  );
}
function PaymentTab({ info, value, onChange }) {
  const [clientSecret, setClientSecret] = useState("");

  const { amount } = info || {};

  useEffect(() => {
    let isCancel = false;
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async (isCancel) => {
      if (isCancel) return;

      // const items = [{ id: "xl-tshirt" }];

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
  }, []);

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) return <Spin spinning={true} />;

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentField
        info={info}
        value={value}
        onChange={onChange}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

function PaymentTabs({ value, onChange, firstPaymentInfo, secondPaymentInfo }) {
  const [activeTab, setActiveTab] = useState("bookingPayment");

  const tabList = [
    {
      key: "bookingPayment",
      tab: "Booking Payment",
      disabled: some(value, (v) => v.part === 1),
    },
    {
      key: "finalPayment",
      tab: "Final Payment",
      disabled: some(value, (v) => v.part === 2),
    },
  ];

  const contentList = {
    "bookingPayment": (
      <PaymentTab info={firstPaymentInfo} value={value} onChange={onChange} />
    ),
    "finalPayment": (
      <PaymentTab info={secondPaymentInfo} value={value} onChange={onChange} />
    ),
  };

  return (
    <Card
      className="w-100"
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={setActiveTab}
      headStyle={{ padding: 0 }}
    >
      {contentList[activeTab]}
    </Card>
  );
}
