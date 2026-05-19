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
  if (score >= 75) return "#84cc16";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#f43f5e";
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
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
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
            filter="url(#glow)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-6xl font-bold tabular tracking-tight"
            style={{ color }}
          >
            {display}
          </motion.span>
          <span className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            / 100
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span
            className="text-5xl font-bold tabular"
            style={{ color }}
          >
            {grade}
          </span>
          <span className="text-zinc-400 text-sm uppercase tracking-widest">
            grade
          </span>
        </div>
        <p className="text-zinc-100 text-xl font-medium mt-2">{verdict}</p>
      </div>
    </div>
  );
}

