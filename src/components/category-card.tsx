import type { CategoryScore } from "@/lib/audit/types";
import { CATEGORY_LABELS } from "@/lib/audit/types";
import { FindingRow } from "./finding-row";

function tone(earned: number, max: number) {
  const r = max === 0 ? 1 : earned / max;
  if (r >= 0.9) return "text-emerald-400 border-emerald-500/30";
  if (r >= 0.6) return "text-lime-300 border-lime-500/30";
  if (r >= 0.4) return "text-amber-300 border-amber-500/30";
  return "text-rose-400 border-rose-500/30";
}

export function CategoryCard({ data }: { data: CategoryScore }) {
  const label = CATEGORY_LABELS[data.category];
  const t = tone(data.earned, data.max);
  return (
    <section
      aria-labelledby={`cat-${data.category}`}
      className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden"
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
        <h3
          id={`cat-${data.category}`}
          className="text-sm uppercase tracking-widest text-zinc-300 font-semibold"
        >
          {label}
        </h3>
        <span
          className={`tabular-nums text-sm font-mono border px-2 py-0.5 rounded-md ${t}`}
        >
          {data.earned} / {data.max}
        </span>
      </header>
      <ul className="divide-y divide-zinc-800/60">
        {data.findings.map((f) => (
          <FindingRow key={f.id} finding={f} />
        ))}
      </ul>
    </section>
  );
}
