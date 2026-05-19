import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { signOutAction } from "@/app/(auth)/actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
        Settings
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        Account
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your basic account info.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Name</label>
              <Input defaultValue={user.name} readOnly />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Email
              </label>
              <Input defaultValue={user.email} readOnly />
            </div>
            <p className="text-xs text-zinc-500">
              Profile editing ships in v1.1. For now contact support to change.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan & billing</CardTitle>
            <CardDescription>Manage your subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-100 font-medium">
                  {user.plan === "pro" ? "Pro" : "Free"} plan
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {user.plan === "pro"
                    ? "$29 / month · billed monthly"
                    : "1 audit / day · 7-day history"}
                </p>
              </div>
              <Badge variant={user.plan === "pro" ? "primary" : "outline"}>
                {user.plan === "pro" ? "Pro" : "Free"}
              </Badge>
            </div>
            <div className="mt-5">
              {user.plan === "pro" ? (
                <Button variant="secondary" disabled>
                  Manage billing (Stripe portal)
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/pricing">Upgrade to Pro — $29/mo</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API access</CardTitle>
            <CardDescription>
              Programmatic audit runs via the Citegrade API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Coming v1.1</Badge>
            <p className="text-xs text-zinc-500 mt-3">
              REST + Webhook support for triggering audits, fetching reports,
              and subscribing to score-change events. Reserved for Pro and
              Agency plans.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>End your session or delete your account.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <form action={signOutAction}>
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
            <Button variant="ghost" disabled>
              Delete account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
