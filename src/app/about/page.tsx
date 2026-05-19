import Link from "next/link";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `${SITE.name} is built by ${SITE.authorName}, a senior Next.js + Cloudflare + AI SEO developer.`,
};

export default async function AboutPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built by one person.{" "}
            <span className="text-indigo-300">In public.</span>
          </h1>
          <div className="mt-8 space-y-5 text-zinc-300 leading-relaxed">
            <p>
              Citegrade is built by {SITE.authorName}, a senior Next.js +
              Cloudflare + AI SEO developer. There is no team, no VC, no
              advisors — just one operator shipping the product and the
              services around it.
            </p>
            <p>
              The premise: AI search is splitting from classical search.
              Sites that rank #1 on Google routinely fail to appear in
              ChatGPT, Claude, or Perplexity answers — because LLMs read
              entities and structure, not keywords. Citegrade scores you on
              the signals that actually matter for the new game.
            </p>
            <p>
              Everything is open. The rubric lives in /docs. The audits are
              free. The source is on{" "}
              <a
                href="https://github.com/AbbanNadeem-SQA/citegrade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
              >
                GitHub
              </a>
              .
            </p>
            <p>
              If you need someone to fix what the audit finds — landing pages,
              full site builds, technical or AI SEO audits, or WordPress →
              Next.js migrations — that&apos;s the day job. Reach out via{" "}
              <a
                href={SITE.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
              >
                Upwork
              </a>
              .
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            <Link
              href="/pricing"
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/40 px-5 py-4 transition-colors group"
            >
              <p className="text-zinc-100 font-medium">Pricing</p>
              <p className="text-sm text-zinc-400 mt-1">
                Free forever for 1 site. Pro at $29/mo.
              </p>
            </Link>
            <Link
              href="/changelog"
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/40 px-5 py-4 transition-colors group"
            >
              <p className="text-zinc-100 font-medium">Changelog</p>
              <p className="text-sm text-zinc-400 mt-1">
                What ships, when. Honest cadence.
              </p>
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
