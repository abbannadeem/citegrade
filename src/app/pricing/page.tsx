import Link from "next/link";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow } from "@/components/eyebrow";
import { PricingToggle } from "@/components/pricing-toggle";

export const metadata = {
  title: "Pricing",
  description:
    "Free forever for one site. Pro at $29/mo unlocks unlimited audits, weekly monitoring, comparison, and PDF export.",
};

export const dynamic = "force-dynamic";

const FREE_FEATURES = [
  "1 audit / day per IP",
  "Full 100-point score breakdown",
  "Public, shareable report",
  "Save 1 site after sign-up",
  "7-day history",
];

const PRO_FEATURES = [
  "Unlimited audits",
  "10 sites monitored",
  "Weekly auto re-scan + alerts",
  "Comparison mode (side-by-side diff)",
  "Unlimited history",
  "PDF export, branded",
  "Public REST API (1k calls/mo)",
  "Email + priority support",
];

const FAQ = [
  {
    q: "Why $29? Why not free forever?",
    a: "The free tier covers one audit per site. Pro pays for the weekly re-audits, change diffs, and the Cloudflare bill. Honest math, not anchoring.",
  },
  {
    q: "What counts as one audit?",
    a: "One scan of one URL. Pro doesn't meter individual checks — unlimited URLs, unlimited re-runs, unlimited sites in the 10-site cap.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click in Settings. You keep all your reports — we just stop the re-audits and the charge. 14-day money-back if you change your mind.",
  },
  {
    q: "Do you offer agency or team plans?",
    a: "Not yet — you can preview teams on Pro. If you're auditing 10+ client sites, email support@citegrade.dev and we'll work something out.",
  },
  {
    q: "Is the methodology public?",
    a: "Every check, weight, and rationale lives at /docs. If a score feels wrong, the math is auditable.",
  },
  {
    q: "What happens if I downgrade?",
    a: "Reports stay readable. We stop auto-monitoring, you lose the API key, and you fall back to 1 audit/day. Nothing is deleted.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1">
        <section className="bg-aurora">
          <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl font-medium tracking-[-0.03em]">
              Free for one site.
              <br />
              <span className="text-muted">Pro when one isn&apos;t enough.</span>
            </h1>
            <p className="mt-5 text-muted max-w-xl mx-auto">
              No card, no signup to start. The free tier is the trial — same
              audit engine, just rate-limited.
            </p>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-5">
            {/* Free */}
            <article className="rounded-2xl border border-line bg-surface shadow-card p-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-medium tracking-tight">Free</h2>
              </div>
              <p className="text-sm text-muted">
                Run one audit a day, on any URL. Share the report.
              </p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-medium tabular tracking-[-0.03em] text-fg">
                  $0
                </span>
                <span className="text-muted text-sm">forever</span>
              </div>
              <p className="text-xs text-subtle mt-2 font-mono">No card.</p>
              <Link
                href="/"
                className="mt-8 inline-flex w-full items-center justify-center h-11 rounded-lg border border-line text-fg text-sm font-medium hover:border-line-strong hover:bg-surface2 transition-colors"
              >
                Run a free audit
              </Link>
              <ul className="mt-7 space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-fg"
                  >
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>

            {/* Pro — highlighted */}
            <article className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary-soft/40 via-surface to-surface shadow-glow p-8">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-fg text-bg text-[10px] font-medium tracking-wider uppercase">
                Most popular
              </span>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-medium tracking-tight">Pro</h2>
              </div>
              <p className="text-sm text-muted">
                Track multiple sites. Watch them weekly. Catch regressions
                early.
              </p>

              <PricingToggle />

              <Link
                href={user ? "/pricing/checkout" : "/sign-up?next=/pricing/checkout"}
                className="mt-8 inline-flex w-full items-center justify-center h-11 rounded-lg bg-gradient-to-b from-[#5b53e8] to-[#4f46e5] text-primary-fg text-sm font-medium tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-6px_rgba(79,70,229,0.4)] hover:from-[#6d65f0] hover:to-[#5b53e8] transition-all active:scale-[0.98]"
              >
                Start Pro
              </Link>
              <ul className="mt-7 space-y-2.5">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-fg"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Trust strip */}
          <div className="max-w-5xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> 14-day
              money-back
            </span>
            <span>·</span>
            <span>Cancel anytime in 1 click</span>
            <span>·</span>
            <span>Reports stay yours on downgrade</span>
            <span>·</span>
            <span>Stripe handles payments</span>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-t border-line bg-bg2/50">
          <div className="max-w-3xl mx-auto px-6">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em]">
              The honest answers.
            </h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                    <h3 className="text-base font-medium tracking-tight text-fg">
                      {f.q}
                    </h3>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-line flex items-center justify-center text-subtle group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted leading-relaxed pr-10">
                    {f.a}
                  </p>
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
