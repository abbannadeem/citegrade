"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, setPlan } from "@/lib/auth";
import {
  billingEnabled,
  createCheckoutSession,
  createPortalSession,
} from "@/lib/billing";

/** Start an upgrade. Uses real Stripe Checkout when configured, else dev-stub. */
export async function startUpgrade(formData: FormData) {
  const plan = (String(formData.get("plan") || "pro") as "pro" | "agency");
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-up?next=/pricing`);

  if (billingEnabled) {
    // SECURITY: Do NOT fall through to setPlan when Stripe is configured but
    // the checkout call returns null — that would silently grant Pro for free.
    const url = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      plan,
      customerId: user.stripeCustomerId,
    });
    if (!url) {
      redirect("/pricing?error=checkout_unavailable");
    }
    redirect(url!);
  }

  // Dev-stub: only when billing is NOT configured (local development).
  await setPlan(user.id, plan);
  redirect("/dashboard?welcome=pro");
}

export async function openBillingPortal() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.stripeCustomerId) {
    const url = await createPortalSession(user.stripeCustomerId);
    if (url) redirect(url);
  }
  redirect("/dashboard/settings?portal=unavailable");
}

export async function downgradeToFree() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  await setPlan(user.id, "free");
  redirect("/dashboard/settings?downgraded=1");
}
