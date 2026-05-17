import type { Finding } from "@/lib/audit/types";
import { Check, AlertTriangle, X } from "lucide-react";

function icon(sev: Finding["severity"]) {
  if (sev === "pass") return <Check className="w-4 h-4 text-emerald-400" />;
  if (sev === "warn")
    return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <X className="w-4 h-4 text-rose-400" />;
}

function leftBorder(sev: Finding["severity"]) {
  if (sev === "pass") return "border-l-emerald-500/60";
  if (sev === "warn") return "border-l-amber-500/60";
  return "border-l-rose-500/60";
}

export function FindingRow({ finding }: { finding: Finding }) {
  return (
    <li className={`pl-4 pr-5 py-4 border-l-2 ${leftBorder(finding.severity)}`}>
      <details className="group">
        <summary className="list-none cursor-pointer flex items-start gap-3">
          <span className="mt-1">{icon(finding.severity)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-zinc-100 font-medium leading-snug">
                {finding.title}
              </p>
              <span className="tabular-nums text-xs text-zinc-500 font-mono shrink-0 mt-1">
                {finding.earned} / {finding.max}
              </span>
            </div>
            {finding.evidence && (
              <p className="mt-1 text-sm text-zinc-400 font-mono leading-relaxed group-open:hidden">
                {finding.evidence.length > 100
                  ? finding.evidence.slice(0, 100) + "…"
                  : finding.evidence}
              </p>
            )}
          </div>
        </summary>
        <div className="mt-3 ml-7 space-y-2">
          {finding.evidence && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                Evidence
              </p>
              <pre className="text-xs text-zinc-300 font-mono bg-zinc-950/60 border border-zinc-800/80 rounded px-3 py-2 whitespace-pre-wrap break-words">
                {finding.evidence}
              </pre>
            </div>
          )}
          {finding.fix && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                Suggested fix
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {finding.fix}
              </p>
            </div>
          )}
        </div>
      </details>
    </li>
  );
}
