import { CheckCircleTwoTone, DownloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Card,
  Collapse,
  Col,
  Form,
  Row,
  Space,
  Spin,
  Button,
  Tooltip,
} from "antd";
import { Header } from "antd/es/layout/layout";
import { Elements } from "@stripe/react-stripe-js";
import { get, size, some } from "lodash";

import { PaymentField } from "../../../../../../components/fields";
import {
  downloadInvoice,
  stripeInstance,
  stripePromise,
} from "../../../../../../assets/js/stripe";
import { formatAsCurrency } from "../../../../../../helpers/number";
import {
  BOOKING_PAYMENT_PERIOD,
  DATETIME_DISPLAY_FORMAT,
  FINAL_PAYMENT_PERIOD,
  PAYMENT_CATEGORIES,
} from "../../../../../../constants/app";
import { makePayment } from "../../../../../../services/database";
import { appRoutes } from "../../../../../../constants/routes";

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

export default function PaymentStep(props) {
  return (
    <Form.Item name="payments">
      <PaymentSection {...props} />
    </Form.Item>
  );
}

function PaymentSection({
  user,
  value,
  onChange,
  netAmount,
  bookingPaymentInfo,
  finalPaymentInfo,
  bookEvent,
}) {
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
    const paymentData = await bookEvent(data, category);

    const currentData = value || [];
    currentData.push(paymentData);
    onChange([...currentData]);
  };

  const totalVendors = get(bookingPaymentInfo, "quantity");
  const isBookingAmtPaid = !!get(bookingPaymentInfo, "invoiceId");
  const isFinalAmtPaid = !!get(finalPaymentInfo, "invoiceId");

  return (
    <Row className="payment-field-container" gutter={[24, 24]}>
      <Col xs={24} sm={24} lg={24} md={24} xl={16} xxl={16}>
        <Collapse activeKey={collapseKeys} expandIconPosition="end" accordion>
          <Collapse.Panel
            key={paymentCategories.booking.text}
            className="bg-white"
            header={
              <PaymentHeader
                title={PAYMENT_CATEGORIES.booking.text}
                invoiceId={get(bookingPaymentInfo, "invoiceId")}
                dueDate={get(bookingPaymentInfo, "dueDate")}
                amount={get(bookingPaymentInfo, "amount")}
                isPaid={isBookingAmtPaid}
              />
            }
            collapsible={isBookingAmtPaid ? "disabled" : undefined}
            showArrow={false}
          >
            <PaymentContent
              userStripeId={get(user, "stripeId")}
              category={paymentCategories.booking.text}
              paymentInfo={bookingPaymentInfo}
              payNow={payNow}
            />
          </Collapse.Panel>

          <Collapse.Panel
            key={paymentCategories.final.text}
            className="bg-white"
            header={
              <PaymentHeader
                title={PAYMENT_CATEGORIES.final.text}
                invoiceId={get(finalPaymentInfo, "invoiceId")}
                dueDate={get(finalPaymentInfo, "dueDate")}
                amount={get(finalPaymentInfo, "amount")}
                isPaid={isFinalAmtPaid}
              />
            }
            collapsible={isFinalAmtPaid ? "disabled" : undefined}
            showArrow={false}
          >
            <PaymentContent
              userStripeId={get(user, "stripeId")}
              category={paymentCategories.final.text}
              paymentInfo={finalPaymentInfo}
              payNow={payNow}
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
              <div>{`${totalVendors} Vendors`}</div>
              <strong>{formatAsCurrency(netAmount)}</strong>
            </div>
          </Card.Grid>
        </Card>
      </Col>
    </Row>
  );
}

function PaymentContent({ userStripeId, category, payNow, paymentInfo }) {
  const [clientSecret, setClientSecret] = useState();

  const { amount } = paymentInfo || {};

  useEffect(() => {
    let isCancel = false;
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async (isCancel) => {
      if (isCancel || !amount) return;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripeInstance.paymentIntents.create({
        customer: userStripeId,
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
  }, [userStripeId, amount]);

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) return <Spin spinning={true} />;

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentField
        userStripeId={userStripeId}
        paymentInfo={paymentInfo}
        payNow={(data) => payNow(data, category)}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

function PaymentHeader({ invoiceId, title, dueDate, amount, isPaid }) {
  const [loading, setLoading] = useState(false);

  const onDownload = async (e) => {
    try {
      setLoading(true);

      await downloadInvoice(invoiceId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Header
      prefixCls="payment-header"
      className="d-flex align-items-start justify-content-between mr-3"
    >
      <Space>
        {isPaid && (
          <CheckCircleTwoTone className="font-24" twoToneColor="#40cf85" />
        )}
        <h5>{title}</h5>

        {isPaid && (
          <Tooltip title="Download Invoice">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={loading}
              onClick={onDownload}
            />
          </Tooltip>
        )}
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
