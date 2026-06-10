"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function PricingToggle() {
  const [annual, setAnnual] = useState(false);
  const proPrice = annual ? "24" : "29";
  const proSuffix = annual ? "/mo · billed yearly" : "/month";

  return (
    <div>
      <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-xs">
        <button
          onClick={() => setAnnual(false)}
          className={cn(
            "px-4 h-8 rounded-full text-xs font-medium tracking-tight transition-colors",
            !annual
              ? "bg-fg text-bg shadow-sm"
              : "text-muted hover:text-fg",
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={cn(
            "px-4 h-8 rounded-full text-xs font-medium tracking-tight transition-colors inline-flex items-center gap-1.5",
            annual
              ? "bg-fg text-bg shadow-sm"
              : "text-muted hover:text-fg",
          )}
        >
          Annual
          <span className="text-[10px] font-mono text-success">−17%</span>
        </button>
      </div>

      <div className="mt-8 flex items-baseline gap-2">
        <span className="text-5xl font-medium tabular tracking-[-0.03em] text-fg">
          ${proPrice}
        </span>
        <span className="text-muted text-sm">{proSuffix}</span>
      </div>
      <p className="text-xs text-subtle mt-2 font-mono">
        Cancel anytime · 14-day money-back
      </p>
    </div>
  );
}
