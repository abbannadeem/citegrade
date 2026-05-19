import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Privacy" };

export default async function PrivacyPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Privacy policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-mono">
            Last updated 2026-05-19
          </p>
          <div className="mt-8 space-y-5 text-zinc-300 leading-relaxed text-sm">
            <h2 className="text-lg font-semibold text-zinc-100 mt-8">
              What we collect
            </h2>
            <p>
              When you run an anonymous audit we store the URL, the resulting
              report, and an opaque request fingerprint for rate limiting.
              When you create an account we store your email, display name,
              and the audits you save.
            </p>
            <h2 className="text-lg font-semibold text-zinc-100 mt-8">
              What we do not collect
            </h2>
            <p>
              No third-party advertising cookies. No tracking pixels on the
              marketing site. We use first-party Plausible for aggregate page
              counts only.
            </p>
            <h2 className="text-lg font-semibold text-zinc-100 mt-8">
              AI and training
            </h2>
            <p>
              We never sell your audit data to model trainers. We never train
              models on user content. We honor robots.txt and noindex headers
              on third-party sites we audit, and we provide a public removal
              endpoint for any host that wants its public reports
              de-indexed.
            </p>
            <h2 className="text-lg font-semibold text-zinc-100 mt-8">
              Retention
            </h2>
            <p>
              Free-tier reports: 7 days. Pro-tier reports: retained for the
              duration of your subscription. You can delete any report from
              your dashboard at any time.
            </p>
            <h2 className="text-lg font-semibold text-zinc-100 mt-8">
              Contact
            </h2>
            <p>
              Privacy questions: reach out via the Upwork link in /about.
            </p>
            <p className="text-xs text-zinc-500 mt-12 pt-6 border-t border-white/[0.06]">
              This is a v1 placeholder while we transition to Termly-generated
              policy with full GDPR/CPRA coverage. Production legal lands with
              the launch of paid plans.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
