import { CheckCircleTwoTone } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Card, Collapse, Col, Form, Row, Space, Spin, message } from "antd";
import Stripe from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { isEmpty, size, some } from "lodash";

import { PaymentField } from "../../../../../../components/fields";
import {
  CLIENT_SECRET,
  stripePromise,
} from "../../../../../../assets/js/stripe";
import { formatAsCurrency } from "../../../../../../helpers/number";
import { Header } from "antd/es/layout/layout";
import {
  bookingPaymentPeriod,
  DATETIME_DISPLAY_FORMAT,
  finalPaymentPeriod,
} from "../../../../../../constants/app";
import { getPayments, makePayment } from "../../../../../../services/database";
import { appRoutes } from "../../../../../../constants/routes";
import { useNavigate } from "react-router-dom";

const appearance = {
  theme: "stripe",
};

const paymentCategories = {
  booking: {
    text: "booking",
  },
  final: {
    text: "final",
  },
};

export default function PaymentStep({ eventId, form, ...rest }) {
  useEffect(() => {
    let isCancel = false;

    async function loadPayments(isCancel) {
      if (isCancel || !eventId) return;

      const payments = await getPayments(eventId);
      console.log("init payments", { payments, eventId });
      if (payments) {
        form.setFieldValue("payments", payments);
      }
    }

    loadPayments(isCancel);

    return () => {
      isCancel = true;
    };
  }, [eventId, form]);

  return (
    <Form.Item name="payments">
      <PaymentSection eventId={eventId} {...rest} />
    </Form.Item>
  );
}

function PaymentSection({
  value,
  onChange,
  netAmount,
  eventId,
  invitees,
  eventCreatedOn,
  bookEvent,
}) {
  const navigate = useNavigate();
  const [collapseKeys, setCollapseKeys] = useState([]);

  useEffect(() => {
    if (!size(value)) {
      setCollapseKeys([paymentCategories.booking.text]);
    } else if (size(value) < size(paymentCategories)) {
      const hasBooking = some(
        value,
        (p) => p.category === paymentCategories.booking.text
      );

      if (hasBooking) {
        setCollapseKeys([paymentCategories.final.text]);
      } else {
        setCollapseKeys([paymentCategories.booking.text]);
      }
    } else {
      setCollapseKeys([]);
    }
  }, [value]);

  const payNow = async (data, category) => {
    if (isEmpty(data)) return;

    data.eventId = eventId;
    data.category = category;
    data.createdOn = new Date();

    const currentData = value || [];
    currentData.push(data);
    onChange([...currentData]);

    await makePayment(data, data.id);

    const bookingPaymentDone = size(currentData) === 1;
    if (bookingPaymentDone && bookEvent) {
      await bookEvent();
      message.success("Event Booked!");
      return;
    }

    const allPaymentsDone = size(currentData) === size(paymentCategories);
    if (allPaymentsDone) {
      navigate(appRoutes.account.dashboard);
      message.success("Payments Completed!");
      return;
    }
  };

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

  let bookingPaymentAmt;
  let finalPaymentAmt;
  if (netAmount) {
    bookingPaymentAmt = netAmount / 2;
    finalPaymentAmt = netAmount / 2;
  }

  const isBookingAmtPaid = some(
    value,
    (v) => v.category === paymentCategories.booking.text
  );
  const isFinalAmtPaid = some(
    value,
    (v) => v.category === paymentCategories.final.text
  );

  if (isEmpty(invitees)) return null;

  return (
    <Row className="payment-field-container" gutter={[24, 24]}>
      <Col xs={24} sm={24} lg={24} md={24} xl={16} xxl={16}>
        <Collapse activeKey={collapseKeys} expandIconPosition="end" accordion>
          <Collapse.Panel
            key={paymentCategories.booking.text}
            className="bg-white"
            header={
              <PaymentHeader
                title="Booking"
                dueDate={bookingPaymentDueDate}
                amount={bookingPaymentAmt}
                isPaid={isBookingAmtPaid}
              />
            }
            collapsible={isBookingAmtPaid ? "disabled" : undefined}
            showArrow={false}
          >
            <PaymentContent
              category={paymentCategories.booking.text}
              amount={bookingPaymentAmt}
              value={value}
              payNow={payNow}
              onChange={onChange}
            />
          </Collapse.Panel>

          <Collapse.Panel
            key={paymentCategories.final.text}
            className="bg-white"
            header={
              <PaymentHeader
                title="Final"
                dueDate={finalPaymentDueDate}
                amount={finalPaymentAmt}
                isPaid={isFinalAmtPaid}
              />
            }
            collapsible={isFinalAmtPaid ? "disabled" : undefined}
            showArrow={false}
          >
            <PaymentContent
              category={paymentCategories.final.text}
              amount={finalPaymentAmt}
              payNow={payNow}
              value={value}
              onChange={onChange}
            />
          </Collapse.Panel>
        </Collapse>
      </Col>

      <Col xs={24} sm={24} lg={24} md={24} xl={8} xxl={8}>
        <Card className="w-100" title="Payment Summary">
          <Card.Grid className="w-100 bg-light-primary" hoverable={false}>
            <div className="text-center m-auto">
              <div className="text-uppercase font-12">Total Amount</div>
              <h5 className="text-primary">{formatAsCurrency(netAmount)}</h5>
            </div>
          </Card.Grid>

          <Card.Grid className="w-100" hoverable={false}>
            <div className="d-flex justify-content-between">
              <div>{`${size(invitees)} Vendors`}</div>
              <strong>{formatAsCurrency(netAmount)}</strong>
            </div>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
}

function PaymentContent({ category, payNow, amount }) {
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    let isCancel = false;
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async (isCancel) => {
      if (isCancel || !amount) return;

      // Create a PaymentIntent with the order amount and currency
      const stripeElem = new Stripe(CLIENT_SECRET);
      const paymentIntent = await stripeElem.paymentIntents.create({
        amount: Math.round(amount),
        currency: "inr",
        payment_method_types: ["card"],
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
        payNow={(data) => payNow(data, category)}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

function PaymentHeader({ title, dueDate, amount, isPaid }) {
  return (
    <Header
      prefixCls="payment-header"
      className="d-flex align-items-start justify-content-between mr-3"
    >
      <Space>
        {isPaid && (
          <CheckCircleTwoTone className="font-24" twoToneColor="#40cf85" />
        )}
        <h5>{title} Payment</h5>
      </Space>

      <div>
        <h5 className="text-right">{formatAsCurrency(amount)}</h5>
        {dueDate && !isPaid && (
          <div className="font-14 mt-1 font-weight-light">
            Due on {dueDate.format(DATETIME_DISPLAY_FORMAT)}
          </div>
        )}
      </div>
    </Header>
  );
}
