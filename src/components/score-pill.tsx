import { cn } from "@/lib/utils";

export function ScorePill({
  score,
  grade,
  size = "md",
}: {
  score: number;
  grade?: string;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 90
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : score >= 75
        ? "bg-lime-500/15 text-lime-300 border-lime-500/30"
        : score >= 60
          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
          : score >= 40
            ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
            : "bg-rose-500/15 text-rose-300 border-rose-500/30";
  const sz =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : size === "lg"
        ? "px-3 py-1 text-sm"
        : "px-2.5 py-0.5 text-xs";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border tabular font-mono",
        color,
        sz,
      )}
    >
      {score}
      {grade && (
        <span className="opacity-60">·{grade}</span>
      )}
    </span>
  );
}
