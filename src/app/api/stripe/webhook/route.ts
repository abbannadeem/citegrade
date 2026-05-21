import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { stripe, planFromPriceId } from "@/lib/billing";
import { getDb, ensureSchema } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 503 });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    return new Response(
      `Webhook signature verification failed: ${err instanceof Error ? err.message : "unknown"}`,
      { status: 400 },
    );
  }

  await ensureSchema();
  const db = getDb();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId =
          session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || "pro";
        if (userId) {
          await db
            .update(users)
            .set({
              plan: plan as "pro" | "agency",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
            })
            .where(eq(users.id, userId));
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const priceId = sub.items?.data?.[0]?.price?.id;
        const plan = planFromPriceId(priceId) ?? "pro";
        const customerId = sub.customer as string;
        const renewsAt = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        const isActive =
          sub.status === "active" || sub.status === "trialing";
        await db
          .update(users)
          .set({
            plan: isActive ? plan : "free",
            planRenewsAt: renewsAt,
          })
          .where(eq(users.stripeCustomerId, customerId));
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId = sub.customer as string;
        await db
          .update(users)
          .set({ plan: "free", stripeSubscriptionId: null })
          .where(eq(users.stripeCustomerId, customerId));
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return new Response("handler error", { status: 500 });
  }

  return Response.json({ received: true });
}
