import { loadStripe } from "@stripe/stripe-js";

export const PUBLIC_KEY = "pk_test_51MmH73SDhUBskKCdHPBSPa3iRjXV7EMwMNNiJermx8HSAga9jQL1eqQOW0nbZYjcbm4EaOpPFe6uqdNQnYqYtUTp00ysvKNMTk";
export const CLIENT_SECRET = "sk_test_51MmH73SDhUBskKCdG6CdvFKUEAcsBeJDPWZBWKuPgneu5sPSsuHFivBlgxqEQ5f9hgMWVHCthTSJrtWT6t0apvQy009UtZh1gi"

export const stripePromise = loadStripe(PUBLIC_KEY);

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
