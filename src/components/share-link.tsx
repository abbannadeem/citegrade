"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-md border border-line hover:border-line-strong px-3 py-1.5 text-xs text-muted hover:text-fg font-mono transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Share report
        </>
      )}
    </button>
  );
}
