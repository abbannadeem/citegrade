import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, upgradeToPro } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock } from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";

export const metadata = { title: "Checkout — Pro" };

async function activate() {
  "use server";
  await upgradeToPro();
  redirect("/dashboard?welcome=pro");
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-up?next=/pricing/checkout");
  if (user.plan === "pro") redirect("/dashboard");
  return (
    <>
      <MarketingHeader isAuthed={true} />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <Badge variant="primary" className="w-fit">
                <Sparkles className="w-3 h-3" /> Pro
              </Badge>
              <CardTitle className="mt-3 text-xl">Upgrade to Citegrade Pro</CardTitle>
              <CardDescription>
                Unlimited audits, weekly monitoring, comparison mode, history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tabular">$29</span>
                  <span className="text-zinc-500">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Billed monthly · cancel anytime
                </p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
                <p className="font-mono">[DEV MODE]</p>
                <p className="mt-1 text-amber-200/80 leading-relaxed">
                  Stripe Checkout is stubbed for v1. Clicking the button below
                  flags your account as Pro locally — no card is charged.
                  Production wiring lands with the Stripe API keys.
                </p>
              </div>
              <form action={activate}>
                <Button type="submit" className="w-full" size="lg">
                  <Lock className="w-4 h-4" />
                  Activate Pro (dev stub)
                </Button>
              </form>
              <p className="text-xs text-zinc-500 text-center">
                <Link
                  href="/pricing"
                  className="hover:text-zinc-300"
                >
                  ← Back to pricing
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
