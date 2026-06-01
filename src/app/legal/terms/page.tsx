import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Terms" };

export default async function TermsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-subtle mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Terms of service
          </h1>
          <p className="mt-2 text-sm text-subtle font-mono">
            Last updated 2026-05-19
          </p>
          <div className="mt-8 space-y-5 text-fg leading-relaxed text-sm">
            <p>
              By using Citegrade you agree to use the service in good faith.
              Don&apos;t use it to harm others, abuse the rate limits, or
              scrape audit data programmatically without a paid API plan.
            </p>
            <h2 className="text-lg font-semibold text-fg mt-8">
              Free tier
            </h2>
            <p>
              The free tier is offered as-is, with rate limits. No SLA, no
              guarantee of availability or accuracy.
            </p>
            <h2 className="text-lg font-semibold text-fg mt-8">
              Paid tiers
            </h2>
            <p>
              Pro and higher tiers are billed monthly via Stripe. You can
              cancel anytime from Settings → Billing. Refunds are issued
              pro-rata for unused time, no questions asked.
            </p>
            <h2 className="text-lg font-semibold text-fg mt-8">
              Audit accuracy
            </h2>
            <p>
              The 100-point rubric is opinionated, not authoritative. A high
              score does not guarantee LLM citation; a low score does not
              prove invisibility. Use Citegrade as a directional signal, not
              a contract.
            </p>
            <h2 className="text-lg font-semibold text-fg mt-8">
              Liability
            </h2>
            <p>
              Citegrade is provided as-is. We are not liable for losses
              resulting from acting on audit recommendations, third-party
              services, or service outages.
            </p>
            <p className="text-xs text-subtle mt-12 pt-6 border-t border-line">
              This is a v1 placeholder. Production legal generated via Termly
              before paid plans go live.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
