interface Props {
  score: number;
  grade: string;
  verdict: string;
}

function colorFor(score: number): string {
  if (score >= 90) return "stroke-emerald-500";
  if (score >= 75) return "stroke-lime-400";
  if (score >= 60) return "stroke-amber-400";
  if (score >= 40) return "stroke-orange-500";
  return "stroke-rose-500";
}

function textColorFor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-lime-300";
  if (score >= 60) return "text-amber-300";
  if (score >= 40) return "text-orange-400";
  return "text-rose-400";
}

export function ScoreGauge({ score, grade, verdict }: Props) {
  const radius = 80;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-zinc-800"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className={`${colorFor(score)} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-6xl font-bold tabular-nums tracking-tight ${textColorFor(score)}`}
          >
            {score}
          </span>
          <span className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            / 100
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span
            className={`text-4xl font-bold tabular-nums ${textColorFor(score)}`}
          >
            {grade}
          </span>
          <span className="text-zinc-400 text-sm">grade</span>
        </div>
        <p className="text-zinc-200 text-lg font-medium mt-1">{verdict}</p>
      </div>
    </div>
  );
}
