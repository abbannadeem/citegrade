import type { CategoryScore } from "@/lib/audit/types";
import { CATEGORY_LABELS } from "@/lib/audit/types";
import { FindingRow } from "./finding-row";

function tone(earned: number, max: number) {
  const r = max === 0 ? 1 : earned / max;
  if (r >= 0.75) return "text-signal-deep";
  if (r >= 0.5) return "text-warn";
  return "text-danger";
}

export function CategoryCard({ data }: { data: CategoryScore }) {
  const label = CATEGORY_LABELS[data.category];
  const ratio = data.max ? data.earned / data.max : 0;
  return (
    <section
      aria-labelledby={`cat-${data.category}`}
      className="border border-line rounded-xl overflow-hidden bg-surface"
    >
      <header className="px-5 py-4 border-b border-line">
        <div className="flex items-center justify-between gap-3">
          <h3
            id={`cat-${data.category}`}
            className="font-mono text-sm text-fg"
          >
            {label}
          </h3>
          <span className={`font-mono text-sm tabular ${tone(data.earned, data.max)}`}>
            {data.earned}
            <span className="text-subtle">/{data.max}</span>
          </span>
        </div>
        <div className="mt-3 h-[3px] rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${ratio * 100}%`,
              background:
                ratio >= 0.75
                  ? "var(--signal-deep)"
                  : ratio >= 0.5
                    ? "var(--warn)"
                    : "var(--danger)",
            }}
          />
        </div>
      </header>
      <ul className="divide-y divide-line">
        {data.findings.map((f) => (
          <FindingRow key={f.id} finding={f} />
        ))}
      </ul>
    </section>
  );
}
