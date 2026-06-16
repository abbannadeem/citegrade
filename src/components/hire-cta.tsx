import type { CategoryScore } from "@/lib/audit/types";
import { GIGS, PRIMARY_GIG_FOR_CATEGORY } from "@/lib/gigs";
import { HireForm } from "./hire-form";
import { ArrowUpRight } from "lucide-react";

interface Props {
  categories: CategoryScore[];
  reportId: string;
  siteHost: string;
  currentScore: number;
}

export function HireCTA({ categories, reportId, siteHost, currentScore }: Props) {
  const failing = categories
    .filter((c) => c.earned / c.max < 0.75)
    .sort((a, b) => a.earned / a.max - b.earned / b.max);

  const gigKeys = new Set(
    failing.map((c) => PRIMARY_GIG_FOR_CATEGORY[c.category]),
  );
  const gigs = [...gigKeys].map((k) => GIGS[k]).filter(Boolean);

  // Estimated score if failing categories are fixed
  const recoverable = failing.reduce((s, c) => s + (c.max - c.earned), 0);
  const potential = Math.min(100, currentScore + recoverable);
  const uplift = potential - currentScore;

  // High score → soft suggestion, no form
  if (gigs.length === 0) {
    return (
      <section className="border border-line rounded-2xl px-7 py-7 bg-surface">
        <p className="eyebrow text-signal-deep">You&apos;re in great shape</p>
        <h3 className="mt-3 text-fg text-xl font-semibold tracking-tight">
          Your site is AI-ready. Want to push it further?
        </h3>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-prose">
          Ship a sister site at this quality, or get help with monitoring,
          structured content for AI citation, and ongoing optimization.
        </p>
        <a
          href={GIGS["ai-seo"].url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg font-mono text-sm group"
        >
          See all services
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {/* Estimated uplift */}
      <div className="border border-line rounded-2xl px-6 sm:px-8 py-7 bg-surface">
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <p className="eyebrow">Hire the auditor</p>
            <h3 className="mt-3 text-fg text-2xl font-semibold leading-snug tracking-display">
              <span className="font-mono text-danger tabular">{currentScore}</span>
              <span className="text-subtle mx-2 font-mono">→</span>
              <span className="font-mono text-signal-deep tabular">~{potential}</span>
            </h3>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              Fixing the {failing.length} failing categor
              {failing.length === 1 ? "y" : "ies"} can lift your score by about{" "}
              <strong className="text-fg font-mono">+{uplift}</strong> points. In
              days, not weeks.
            </p>
          </div>
          <div>
            <HireForm
              reportId={reportId}
              siteHost={siteHost}
              currentScore={currentScore}
              potentialScore={potential}
            />
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div className="border border-line rounded-2xl px-6 py-5 bg-surface">
        <p className="rule-label mb-4">Services that fit what failed</p>
        <ul className="grid sm:grid-cols-2 gap-px bg-line border border-line rounded-lg overflow-hidden">
          {gigs.map((g) => (
            <li key={g.key} className="bg-surface">
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block px-4 py-3.5 hover:bg-surface2 transition-colors h-full"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-fg font-medium leading-snug">{g.title}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {g.blurb}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-subtle font-mono text-xs tabular">
                      from {g.startingPrice}
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-subtle group-hover:text-fg ml-auto mt-1 transition-colors" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
