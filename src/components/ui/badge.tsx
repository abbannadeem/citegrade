import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tabular leading-none tracking-tight border",
  {
    variants: {
      variant: {
        default: "bg-surface2 text-muted border-line",
        primary: "bg-primary-soft text-primary border-primary/20",
        success: "bg-success-soft text-success border-success/20",
        warn: "bg-warn-soft text-warn border-warn/20",
        danger: "bg-danger-soft text-danger border-danger/20",
        outline: "border-line text-muted",
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
