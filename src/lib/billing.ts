import Stripe from "stripe";
import { siteUrl } from "./site";

const secretKey = process.env.STRIPE_SECRET_KEY;
const PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";
const PRICE_AGENCY = process.env.STRIPE_PRICE_AGENCY || "";

export const stripe = secretKey ? new Stripe(secretKey) : null;

export const billingEnabled = !!stripe && !!PRICE_PRO;

const PRICE_FOR: Record<string, string> = {
  pro: PRICE_PRO,
  agency: PRICE_AGENCY,
};

/**
 * Creates a Stripe Checkout session for the given plan and returns the URL.
 * When Stripe is not configured (no keys) returns null so callers can fall
 * back to the dev-stub upgrade flow.
 */
export async function createCheckoutSession(opts: {
  userId: string;
  email: string;
  plan: "pro" | "agency";
  customerId?: string | null;
}): Promise<string | null> {
  if (!stripe || !billingEnabled) return null;
  const price = PRICE_FOR[opts.plan];
  if (!price) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer: opts.customerId || undefined,
    customer_email: opts.customerId ? undefined : opts.email,
    client_reference_id: opts.userId,
    metadata: { userId: opts.userId, plan: opts.plan },
    subscription_data: { metadata: { userId: opts.userId, plan: opts.plan } },
    success_url: siteUrl("/dashboard?welcome=pro"),
    cancel_url: siteUrl("/pricing"),
    allow_promotion_codes: true,
  });
  return session.url;
}

export async function createPortalSession(
  customerId: string,
): Promise<string | null> {
  if (!stripe) return null;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: siteUrl("/dashboard/settings"),
  });
  return session.url;
}

export function planFromPriceId(priceId: string | undefined): "pro" | "agency" | null {
  if (!priceId) return null;
  if (priceId === PRICE_PRO) return "pro";
  if (priceId === PRICE_AGENCY) return "agency";
  return null;
}
