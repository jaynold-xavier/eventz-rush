import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";

import { stripeInstance } from "../../../assets/js/stripe";

const paymentElementOptions = {
  layout: "tabs",
};

export default function PaymentField({
  userStripeId,
  paymentInfo,
  payNow,
  clientSecret,
  ...rest
}) {
  const [loading, setLoading] = useState(false);
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
          message.error("Something went wrong." + " " + `(status code: ${paymentIntent.status})`);
          break;
      }
    });
  }, [stripe, clientSecret]);

  const onPayNow = async (e) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    try {
      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      console.log({ error, paymentIntent });

      if (!error) {
        const invoice = await stripeInstance.invoices.create({
          customer: userStripeId,
          pending_invoice_items_behavior: "exclude",
          collection_method: "send_invoice",
          due_date: paymentInfo.dueDate.unix(),
        });

        const product = await stripeInstance.products.create({
          name: "Vendors",
          description: "Payment to vendors",
          type: "service",
        });

        await stripeInstance.invoiceItems.create({
          customer: userStripeId,
          invoice: invoice.id,
          quantity: paymentInfo.quantity,
          price_data: {
            currency: "inr",
            tax_behavior: "exclusive",
            product: product.id,
            unit_amount: paymentIntent.amount,
          },
        });

        await stripeInstance.invoices.finalizeInvoice(invoice.id);

        await payNow({
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          invoiceId: invoice.id,
          type: "card",
        });

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
    } catch (err) {
      console.log("payment error", err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-field">
      <div className="font-weight-bold mb-3">Payment Details</div>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        {...rest}
      />

      <br />

      <Button type="primary" loading={loading} onClick={onPayNow} block>
        Pay Now
      </Button>
    </div>
  );
}
