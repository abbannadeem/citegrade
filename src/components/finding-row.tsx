import type { Finding } from "@/lib/audit/types";

function tag(sev: Finding["severity"]) {
  if (sev === "pass")
    return { label: "PASS", cls: "text-signal-deep", dot: "var(--signal-deep)" };
  if (sev === "warn")
    return { label: "WARN", cls: "text-warn", dot: "var(--warn)" };
  return { label: "FAIL", cls: "text-danger", dot: "var(--danger)" };
}

export function FindingRow({ finding }: { finding: Finding }) {
  const t = tag(finding.severity);
  return (
    <li className="px-5 py-4">
      <details className="group">
        <summary className="list-none cursor-pointer flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1.5 w-1.5 h-1.5 rounded-[1px] shrink-0"
            style={{ background: t.dot }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-fg font-medium leading-snug">
                <span className={`font-mono text-[11px] tracking-wider mr-2 ${t.cls}`}>
                  {t.label}
                </span>
                {finding.title}
              </p>
              <span className="font-mono text-xs tabular text-subtle shrink-0 mt-0.5">
                {finding.earned}/{finding.max}
              </span>
            </div>
            {finding.evidence && (
              <p className="mt-1 text-sm text-muted font-mono leading-relaxed group-open:hidden truncate">
                {finding.evidence.length > 100
                  ? finding.evidence.slice(0, 100) + "…"
                  : finding.evidence}
              </p>
            )}
          </div>
        </summary>
        <div className="mt-3 ml-[18px] space-y-3">
          {finding.evidence && (
            <div>
              <p className="rule-label mb-1.5">Evidence</p>
              <pre className="text-xs text-fg font-mono bg-surface2 border border-line rounded-md px-3 py-2 whitespace-pre-wrap break-words">
                {finding.evidence}
              </pre>
            </div>
          )}
          {finding.fix && (
            <div>
              <p className="rule-label mb-1.5">Suggested fix</p>
              <p className="text-sm text-muted leading-relaxed">{finding.fix}</p>
            </div>
          )}
        </div>
      </details>
    </li>
  );
}
