import React, { useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Col, message, Row } from "antd";

const paymentElementOptions = {
  layout: "tabs",
};

export default function PaymentField({
  value,
  onChange,
  clientSecret,
  ...rest
}) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent.payment_method) return;

      switch (paymentIntent.status) {
        case "succeeded":
          message.success("Payment succeeded!");
          break;
        case "processing":
          message.info("Your payment is processing.");
          break;
        case "requires_payment_method":
          message.warning("Your payment was not successful, please try again.");
          break;
        default:
          message.error("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const makePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (!error) {
      console.log({ paymentIntent });
      message.success("Payment succeeded!");
      return;
    }

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      message.error(error.message);
    } else {
      message.error("An unexpected error occurred.");
    }
  };

  return (
    <Row gutter={[12, 24]}>
      <Col span={24}>
        <div className="font-weight-bold mb-3">Payment Details</div>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
          {...rest}
        />
      </Col>

      <Col span={24}>
        <Button type="primary" onClick={makePayment} block>
          Pay
        </Button>
      </Col>
    </Row>
  );
}
