import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { listApiKeys } from "@/lib/api-keys";
import { limitsFor } from "@/lib/plans";
import { billingEnabled } from "@/lib/billing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  updateProfileAction,
  createApiKeyAction,
  revokeApiKeyAction,
} from "@/app/dashboard/settings-actions";
import {
  openBillingPortal,
  downgradeToFree,
} from "@/app/dashboard/billing-actions";
import { signOutAction } from "@/app/(auth)/actions";
import { relativeTime } from "@/lib/utils";
import { KeyRound, Trash2 } from "lucide-react";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  const limits = limitsFor(user.plan);
  const keys = await listApiKeys(user.id);
  const c = await cookies();
  const newKey = c.get("citegrade_new_key")?.value ?? null;

  return (
    <div className="px-6 lg:px-10 py-10 max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
        Settings
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        Account
      </h1>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Name</label>
                <Input name="name" defaultValue={user.name} />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
                <Input defaultValue={user.email} readOnly className="opacity-60" />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Plan & billing */}
        <Card>
          <CardHeader>
            <CardTitle>Plan & billing</CardTitle>
            <CardDescription>Manage your subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-100 font-medium">{limits.name} plan</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {user.plan === "free"
                    ? `${limits.auditsPerDay} audits/day · ${limits.sites} site · ${limits.historyDays}-day history`
                    : `$${limits.priceMonthly}/mo · unlimited audits · ${limits.sites} sites`}
                </p>
              </div>
              <Badge variant={user.plan === "free" ? "outline" : "primary"}>
                {limits.name}
              </Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {user.plan === "free" ? (
                <Button asChild>
                  <Link href="/pricing/checkout">Upgrade to Pro — $29/mo</Link>
                </Button>
              ) : (
                <>
                  {user.stripeCustomerId && billingEnabled ? (
                    <form action={openBillingPortal}>
                      <Button type="submit" variant="secondary">
                        Manage billing
                      </Button>
                    </form>
                  ) : (
                    <form action={downgradeToFree}>
                      <Button type="submit" variant="outline">
                        Downgrade to Free
                      </Button>
                    </form>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API keys */}
        <Card>
          <CardHeader>
            <CardTitle>API access</CardTitle>
            <CardDescription>
              Programmatic audits via{" "}
              <code className="font-mono text-zinc-300">POST /api/v1/audit</code>
              . {limits.apiAccess ? "" : "Pro feature."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {newKey && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-xs text-emerald-300 mb-2">
                  New key — copy it now, it won&apos;t be shown again:
                </p>
                <code className="block font-mono text-sm text-zinc-100 break-all bg-black/30 rounded px-3 py-2">
                  {newKey}
                </code>
              </div>
            )}

            {!limits.apiAccess ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  Upgrade to Pro to generate API keys.
                </p>
                <Button asChild size="sm">
                  <Link href="/pricing/checkout">Upgrade</Link>
                </Button>
              </div>
            ) : (
              <>
                <form action={createApiKeyAction} className="flex gap-2">
                  <Input
                    name="name"
                    placeholder="Key name (e.g. CI pipeline)"
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" size="md">
                    <KeyRound className="w-4 h-4" /> Generate
                  </Button>
                </form>

                {keys.length > 0 && (
                  <ul className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.06]">
                    {keys.map((k) => (
                      <li
                        key={k.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-200">
                            {k.name}{" "}
                            <code className="font-mono text-xs text-zinc-500">
                              {k.prefix}…
                            </code>
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {k.revokedAt
                              ? "revoked"
                              : k.lastUsedAt
                                ? `last used ${relativeTime(k.lastUsedAt)}`
                                : "never used"}
                          </p>
                        </div>
                        {!k.revokedAt && (
                          <form action={revokeApiKeyAction}>
                            <input type="hidden" name="id" value={k.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              aria-label="Revoke key"
                            >
                              <Trash2 className="w-4 h-4 text-rose-400" />
                            </Button>
                          </form>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>Sign out of your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signOutAction}>
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
