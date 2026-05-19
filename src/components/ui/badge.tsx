import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tabular leading-none tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-white/[0.08] text-zinc-200 border border-white/[0.08]",
        primary:
          "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
        success:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        warn: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
        danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
        outline: "border border-white/[0.12] text-zinc-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
