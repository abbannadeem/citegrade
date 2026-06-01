import type { CategoryScore } from "@/lib/audit/types";
import { GIGS, PRIMARY_GIG_FOR_CATEGORY } from "@/lib/gigs";
import { HireForm } from "./hire-form";
import { Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

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
      <section className="relative rounded-2xl overflow-hidden border border-success/30 bg-gradient-to-br from-success-soft via-surface to-surface px-8 py-7">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-success/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-success" />
            <p className="text-[10px] uppercase tracking-widest text-success font-semibold">
              You&apos;re in great shape
            </p>
          </div>
          <h3 className="text-fg text-xl font-semibold leading-snug">
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
            className="mt-5 inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-medium text-sm group"
          >
            See all services
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {/* Estimated uplift hero */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary-soft via-surface to-surface px-6 sm:px-8 py-6">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid sm:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                Hire me to fix this
              </p>
            </div>
            <h3 className="text-fg text-xl sm:text-2xl font-semibold leading-snug tracking-tight">
              From{" "}
              <span className="font-mono text-danger tabular">{currentScore}</span>
              {" → "}
              <span className="font-mono text-success tabular">~{potential}</span>
            </h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Fixing the {failing.length} failing categor
              {failing.length === 1 ? "y" : "ies"} can lift your score by about{" "}
              <strong className="text-fg">+{uplift} points</strong>. I can do it
              in days, not weeks.
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
      <div className="rounded-2xl border border-line bg-surface px-6 py-5 shadow-card">
        <p className="text-[10px] uppercase tracking-widest text-subtle mb-3">
          Services that fit what failed
        </p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {gigs.map((g) => (
            <li key={g.key}>
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-line hover:border-primary/40 px-4 py-3.5 transition-all hover:shadow-card group bg-surface"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-fg font-medium leading-snug group-hover:text-primary transition-colors">
                      {g.title}
                    </p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {g.blurb}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-primary font-mono text-sm font-semibold tabular">
                      from {g.startingPrice}
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-subtle group-hover:text-primary ml-auto mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
