import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "Pricing",
  description:
    "Citegrade is free forever for 1 site. Pro at $29/mo unlocks unlimited audits, weekly monitoring, comparison, PDF export, and history retention.",
};

export const dynamic = "force-dynamic";

const TIERS = [
  {
    name: "Scan",
    price: "$0",
    period: "forever",
    description: "See your AI search score without signing up.",
    cta: "Start scanning",
    href: "/",
    highlight: false,
    features: [
      "1 audit / day per IP",
      "Full 100-point score breakdown",
      "Public, shareable report",
      "1 site saved to dashboard",
      "7-day history",
      "Powered-by Citegrade badge on report",
    ],
  },
  {
    name: "Monitor",
    price: "$29",
    period: "/ month",
    description: "Track your sites. Catch regressions. Beat competitors.",
    cta: "Upgrade to Pro",
    href: "/pricing/checkout",
    highlight: true,
    features: [
      "Unlimited audits",
      "10 sites monitored",
      "Weekly auto re-scans",
      "Unlimited history + trend graphs",
      "Side-by-side comparison mode",
      "PDF export (unbranded)",
      "Email alerts on score drops",
      "Priority support",
    ],
  },
];

const FAQ = [
  {
    q: "Is the free tier really free forever?",
    a: "Yes. 1 audit per day, 1 saved site, 7-day history. No card required. Pro is when you need monitoring, history, comparisons, or PDF exports.",
  },
  {
    q: "Annual billing?",
    a: "Coming with v1.1 — 2 months free on annual ($290/year). Pay monthly works for everyone today.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Manage your subscription in Settings → Stripe Customer Portal. No questions, no retention emails.",
  },
  {
    q: "Agency / white-label?",
    a: "On the v1.1 roadmap. $79/mo for 75 sites + white-label reports + client workspaces. Email me if you need it sooner.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Citegrade Pro",
    description: "Continuous AI SEO monitoring for up to 10 sites.",
    offers: {
      "@type": "Offer",
      price: "29.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <>
      <JsonLd data={productSchema} />
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1">
        <section className="relative px-6 py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-aurora pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <Sparkles className="w-3 h-3" /> Pricing
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Score for free.
              <br />
              <span className="text-indigo-300">Monitor for $29.</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400 max-w-xl mx-auto">
              No usage credits. No hidden seat fees. Cancel anytime, no
              retention loops.
            </p>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-7 ${
                  tier.highlight
                    ? "border-indigo-500/40 bg-indigo-500/[0.04] shadow-[0_0_60px_rgba(94,92,230,0.08)]"
                    : "border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {tier.highlight && (
                  <Badge
                    variant="primary"
                    className="absolute -top-3 right-7"
                  >
                    Most popular
                  </Badge>
                )}
                <h3 className="text-xs uppercase tracking-widest text-zinc-500">
                  {tier.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight tabular">
                    {tier.price}
                  </span>
                  <span className="text-zinc-500">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-400">{tier.description}</p>

                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={tier.highlight ? "primary" : "secondary"}
                  size="lg"
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>

                <ul className="mt-7 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                    >
                      <Check className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-zinc-500 max-w-xl mx-auto">
            Need an agency tier (white-label, 75 sites, client workspaces)?{" "}
            <Link
              href="/about"
              className="text-indigo-300 hover:text-indigo-200"
            >
              Reach out
            </Link>{" "}
            — agency pricing ships v1.1.
          </p>
        </section>

        <section className="px-6 py-20 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              Frequently asked
            </h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4">
                    <span className="font-medium text-zinc-100">{f.q}</span>
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-zinc-400">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
