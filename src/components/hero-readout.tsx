"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

/**
 * Hero instrument readout — an illustrative sample of the product's output
 * (host shown as "your-site.com"). Not a metric or social-proof claim: it is
 * the audit UI itself, animated once on load. A lime scan-line sweeps the
 * panel, the score ticks up, and the category bars settle into place.
 */

type Row = { label: string; earned: number; max: number };

const SAMPLE: Row[] = [
  { label: "llms.txt", earned: 6, max: 15 },
  { label: "json-ld", earned: 22, max: 25 },
  { label: "semantic", earned: 13, max: 15 },
  { label: "metadata", earned: 12, max: 15 },
  { label: "crawl", earned: 14, max: 15 },
  { label: "e-e-a-t", earned: 11, max: 15 },
];

const SCORE = 78;

const EVIDENCE: { ok: boolean; text: string }[] = [
  { ok: true, text: "schema.org/Organization — detected" },
  { ok: false, text: "/llms.txt — 404, not found" },
  { ok: true, text: "<h1> — single, unique" },
];

function barColor(ratio: number) {
  if (ratio >= 0.8) return "var(--signal)";
  if (ratio >= 0.5) return "#e0b341";
  return "#d97a5c";
}

function Dial({ score, reduced }: { score: number; reduced: boolean }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const count = useMotionValue(reduced ? score : 0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const offset = useTransform(count, (v) => circ - (v / 100) * circ);
  const [display, setDisplay] = useState(reduced ? score : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(score);
      return;
    }
    const controls = animate(count, score, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.35,
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, count, rounded, reduced]);

  return (
    <div className="relative w-[128px] h-[128px] shrink-0">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="9"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{ strokeDashoffset: reduced ? circ - (score / 100) * circ : offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[2.6rem] leading-none tabular text-instrument-fg">
          {display}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-instrument-muted mt-1">
          / 100 · B
        </span>
      </div>
    </div>
  );
}

export function HeroReadout() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="instrument relative overflow-hidden rounded-xl border border-instrument-line bg-instrument text-instrument-fg shadow-pop">
      <div className="absolute inset-0 bg-grid opacity-[0.5] pointer-events-none" />

      {/* scan-line sweep, once on load */}
      {!reduced && (
        <div
          aria-hidden
          className="animate-scanline absolute left-0 right-0 top-0 h-px pointer-events-none z-10"
          style={{
            ["--scan-distance" as string]: "340px",
            background:
              "linear-gradient(90deg, transparent, var(--signal), transparent)",
            boxShadow: "0 0 12px 1px color-mix(in srgb, var(--signal) 50%, transparent)",
          }}
        />
      )}

      <div className="relative p-5 sm:p-6">
        {/* fake browser/url bar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-instrument-line">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
            <span className="font-mono text-xs text-instrument-muted truncate">
              your-site.com
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.18em] text-instrument-muted uppercase">
            scan complete
          </span>
        </div>

        <div className="flex items-center gap-5 pt-5">
          <Dial score={SCORE} reduced={reduced} />
          <div className="flex-1 min-w-0 space-y-2">
            {SAMPLE.map((row, i) => {
              const ratio = row.earned / row.max;
              return (
                <div key={row.label} className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-instrument-muted w-[58px] shrink-0 truncate">
                    {row.label}
                  </span>
                  <div className="flex-1 h-[5px] rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: barColor(ratio) }}
                      initial={{ width: reduced ? `${ratio * 100}%` : 0 }}
                      animate={{ width: `${ratio * 100}%` }}
                      transition={{
                        duration: 0.9,
                        delay: reduced ? 0 : 0.55 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] tabular text-instrument-muted w-8 text-right shrink-0">
                    {row.earned}/{row.max}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* evidence lines */}
        <div className="mt-5 pt-4 border-t border-instrument-line space-y-1.5">
          {EVIDENCE.map((e) => (
            <div key={e.text} className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-1.5 rounded-[1px] shrink-0"
                style={{ background: e.ok ? "var(--signal)" : "#d97a5c" }}
              />
              <span className="font-mono text-[11px] text-instrument-muted truncate">
                <span style={{ color: e.ok ? "var(--signal)" : "#e09180" }}>
                  {e.ok ? "PASS" : "FAIL"}
                </span>{" "}
                {e.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
