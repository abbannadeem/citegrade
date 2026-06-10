import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  primary,
  secondary,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-card px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-5 shadow-xs">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-fg">{title}</h3>
      <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {(primary || secondary) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primary && (
            <Link
              href={primary.href}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#5b53e8] to-[#4f46e5] text-primary-fg text-sm font-medium tracking-tight px-4 h-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-4px_rgba(79,70,229,0.4)] hover:from-[#6d65f0] hover:to-[#5b53e8] transition-all"
            >
              {primary.label}
            </Link>
          )}
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line text-fg text-sm font-medium tracking-tight px-4 h-10 hover:border-line-strong hover:bg-surface2 transition-colors"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
