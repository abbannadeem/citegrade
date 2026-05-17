import type { CategoryScore } from "@/lib/audit/types";
import { GIGS, PRIMARY_GIG_FOR_CATEGORY } from "@/lib/gigs";
import { ArrowUpRight } from "lucide-react";

export function HireCTA({ categories }: { categories: CategoryScore[] }) {
  const failing = categories
    .filter((c) => c.earned / c.max < 0.75)
    .sort((a, b) => a.earned / a.max - b.earned / b.max);

  const gigKeys = new Set(failing.map((c) => PRIMARY_GIG_FOR_CATEGORY[c.category]));
  const gigs = [...gigKeys].map((k) => GIGS[k]).filter(Boolean);

  if (gigs.length === 0) {
    return (
      <section className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-6 py-5">
        <p className="text-emerald-200 font-medium">
          Your site is in solid shape. If you want to push it further or
          ship a sister site at this level, see what I offer:
        </p>
        <a
          href={GIGS["ai-seo"].url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 text-sm font-medium"
        >
          See all services <ArrowUpRight className="w-4 h-4" />
        </a>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-6 py-5">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
        Want this fixed for you?
      </p>
      <h3 className="text-zinc-100 text-lg font-semibold leading-snug">
        Based on what failed, these are the services that fit:
      </h3>
      <ul className="mt-4 space-y-3">
        {gigs.map((g) => (
          <li key={g.key}>
            <a
              href={g.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-zinc-800 hover:border-emerald-500/40 px-4 py-3 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-zinc-100 font-medium group-hover:text-emerald-300 transition-colors">
                    {g.title}
                  </p>
                  <p className="text-sm text-zinc-400 mt-0.5">{g.blurb}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-emerald-400 font-mono text-sm tabular-nums">
                    from {g.startingPrice}
                  </p>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 ml-auto mt-1 transition-colors" />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
