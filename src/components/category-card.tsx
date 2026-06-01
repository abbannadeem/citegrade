import type { CategoryScore } from "@/lib/audit/types";
import { CATEGORY_LABELS } from "@/lib/audit/types";
import { FindingRow } from "./finding-row";

function tone(earned: number, max: number) {
  const r = max === 0 ? 1 : earned / max;
  if (r >= 0.9)
    return "text-emerald-700 dark:text-success border-emerald-500/30 bg-success-soft";
  if (r >= 0.6)
    return "text-lime-700 dark:text-lime-300 border-lime-500/30 bg-lime-500/5";
  if (r >= 0.4)
    return "text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/5";
  return "text-rose-700 dark:text-rose-300 border-rose-500/30 bg-rose-500/5";
}

export function CategoryCard({ data }: { data: CategoryScore }) {
  const label = CATEGORY_LABELS[data.category];
  const t = tone(data.earned, data.max);
  return (
    <section
      aria-labelledby={`cat-${data.category}`}
      className="rounded-xl border border-line bg-surface overflow-hidden shadow-card"
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h3
          id={`cat-${data.category}`}
          className="text-sm uppercase tracking-widest text-muted font-semibold"
        >
          {label}
        </h3>
        <span
          className={`tabular text-sm font-mono border px-2 py-0.5 rounded-md ${t}`}
        >
          {data.earned} / {data.max}
        </span>
      </header>
      <ul className="divide-y divide-line">
        {data.findings.map((f) => (
          <FindingRow key={f.id} finding={f} />
        ))}
      </ul>
    </section>
  );
}
