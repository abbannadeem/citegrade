"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

interface Props {
  score: number;
  grade: string;
  verdict: string;
}

function colorFor(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#65a30d";
  if (score >= 60) return "#d97706";
  if (score >= 40) return "#ea580c";
  return "#e11d48";
}

export function ScoreGauge({ score, grade, verdict }: Props) {
  const radius = 80;
  const circ = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const dash = useTransform(count, (v) => (v / 100) * circ);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, count, rounded]);

  const color = colorFor(score);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-52 h-52 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="14"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{ strokeDashoffset: useTransform(dash, (d) => circ - d) }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-6xl font-bold tabular tracking-tight"
            style={{ color }}
          >
            {display}
          </motion.span>
          <span className="text-xs uppercase tracking-widest text-subtle mt-1">
            / 100
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold tabular" style={{ color }}>
            {grade}
          </span>
          <span className="text-muted text-sm uppercase tracking-widest">
            grade
          </span>
        </div>
        <p className="text-fg text-xl font-medium mt-2">{verdict}</p>
      </div>
    </div>
  );
}
