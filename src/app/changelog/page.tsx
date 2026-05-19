import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Changelog",
  description: "What we ship, when we ship it. Build-in-public.",
};

interface Entry {
  date: string;
  version: string;
  title: string;
  type: "new" | "improved" | "fixed";
  body: string;
}

const ENTRIES: Entry[] = [
  {
    date: "2026-05-19",
    version: "v1.0.0",
    type: "new",
    title: "Citegrade v1 — public launch",
    body: "Full SaaS launch. Sign-up, dashboard, multi-site tracking, comparison mode, public leaderboard, Pro tier at $29/mo. Stripe wiring shipped in dev-stub mode pending API keys.",
  },
  {
    date: "2026-05-19",
    version: "v0.2.0",
    type: "improved",
    title: "Premium UI overhaul",
    body: "New visual identity: deep indigo + violet gradients, refreshed typography, aurora-glow hero, sidebar + topbar app shell, Cmd+K command palette, animated sparklines, score pills.",
  },
  {
    date: "2026-05-19",
    version: "v0.1.0",
    type: "new",
    title: "Initial Citegrade scaffold",
    body: "100-point AI SEO audit engine across six categories (llms.txt, JSON-LD, semantic HTML, meta, crawlability, E-E-A-T). Shareable public reports with dynamic OG images. Self-audit scores 96/100.",
  },
];

const TYPE_STYLES: Record<Entry["type"], { variant: "primary" | "success" | "warn"; label: string }> = {
  new: { variant: "primary", label: "New" },
  improved: { variant: "success", label: "Improved" },
  fixed: { variant: "warn", label: "Fixed" },
};

export default async function ChangelogPage() {
  const user = await getCurrentUser();
  return (
    <>
      <MarketingHeader isAuthed={!!user} />
      <main className="flex-1 px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <Badge variant="primary" className="mb-6">
            <Sparkles className="w-3 h-3" /> Build-in-public
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Changelog
          </h1>
          <p className="mt-3 text-zinc-400">
            What ships, when. Honest cadence. RSS feed coming with v1.1.
          </p>

          <div className="mt-12 space-y-12">
            {ENTRIES.map((e, i) => {
              const t = TYPE_STYLES[e.type];
              return (
                <article
                  key={`${e.version}-${i}`}
                  className="relative pl-8 border-l border-white/[0.08] pb-2"
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500/30 border border-indigo-500/50" />
                  <div className="flex items-center gap-3 mb-2">
                    <time
                      dateTime={e.date}
                      className="text-xs font-mono text-zinc-500"
                    >
                      {e.date}
                    </time>
                    <Badge variant={t.variant}>{t.label}</Badge>
                    <span className="text-xs font-mono text-zinc-600">
                      {e.version}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    {e.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {e.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
