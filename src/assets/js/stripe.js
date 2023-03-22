import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const PUBLIC_KEY =
  "pk_test_51MmH73SDhUBskKCdHPBSPa3iRjXV7EMwMNNiJermx8HSAga9jQL1eqQOW0nbZYjcbm4EaOpPFe6uqdNQnYqYtUTp00ysvKNMTk";
export const CLIENT_SECRET =
  "sk_test_51MmH73SDhUBskKCdG6CdvFKUEAcsBeJDPWZBWKuPgneu5sPSsuHFivBlgxqEQ5f9hgMWVHCthTSJrtWT6t0apvQy009UtZh1gi";

export const stripePromise = loadStripe(PUBLIC_KEY);
export const stripeInstance = new Stripe(CLIENT_SECRET);

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

export const downloadInvoice = async (id) => {
  if (!id) return;

  const invoice = await stripeInstance.invoices.retrieve(id);
  const a = document.createElement("a");
  a.href = invoice.invoice_pdf;
  a.download = "Invoice";
  a.click();
};
