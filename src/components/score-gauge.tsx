"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

interface Props {
  score: number;
  grade: string;
  verdict: string;
}

/** Tiered colour, tuned to read on the dark instrument surface. */
function colorFor(score: number): string {
  if (score >= 75) return "#c6f24e"; // signal-lime
  if (score >= 60) return "#e0b341"; // amber
  if (score >= 40) return "#e08a4e"; // orange
  return "#e0675a"; // red
}

export function ScoreGauge({ score, grade, verdict }: Props) {
  const reduced = useReducedMotion() ?? false;
  const radius = 80;
  const circ = 2 * Math.PI * radius;

  const count = useMotionValue(reduced ? score : 0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const dashOffset = useTransform(count, (v) => circ - (v / 100) * circ);
  const [display, setDisplay] = useState(reduced ? score : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(score);
      return;
    }
    const controls = animate(count, score, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, count, rounded, reduced]);

  const color = colorFor(score);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="12"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{
              strokeDashoffset: reduced
                ? circ - (score / 100) * circ
                : dashOffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-6xl tabular leading-none"
            style={{ color }}
          >
            {display}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-instrument-muted mt-2">
            / 100
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-5xl tabular" style={{ color }}>
            {grade}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-instrument-muted">
            grade
          </span>
        </div>
        <p className="text-instrument-fg text-xl font-medium mt-3 tracking-tight">
          {verdict}
        </p>
      </div>
    </div>
  );
}
