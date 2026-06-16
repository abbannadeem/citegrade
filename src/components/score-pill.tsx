import { cn } from "@/lib/utils";

/**
 * Editorial mono score readout — ink/olive/amber/red by tier, no candy fills.
 */
export function ScorePill({
  score,
  grade,
  size = "md",
}: {
  score: number;
  grade?: string;
  size?: "sm" | "md" | "lg";
}) {
  const tone =
    score >= 75
      ? "text-signal-deep dark:text-signal"
      : score >= 60
        ? "text-warn"
        : "text-danger";
  const sz = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  return (
    <span
      className={cn("inline-flex items-baseline gap-1.5 font-mono tabular", sz)}
    >
      <span className={tone}>{score}</span>
      {grade && <span className="text-subtle text-[0.85em]">{grade}</span>}
    </span>
  );
}
