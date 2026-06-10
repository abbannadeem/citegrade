import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-tight transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-[#5b53e8] to-[#4f46e5] text-primary-fg hover:from-[#6d65f0] hover:to-[#5b53e8] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(79,70,229,0.4),0_8px_24px_-4px_rgba(79,70,229,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(79,70,229,0.4),0_12px_28px_-4px_rgba(79,70,229,0.5)] dark:from-indigo-500 dark:to-indigo-600",
        secondary:
          "bg-surface2 text-fg border border-line hover:border-line-strong hover:bg-surface shadow-xs",
        ghost: "text-muted hover:text-fg hover:bg-surface2",
        outline:
          "border border-line text-fg hover:border-line-strong hover:bg-surface2 shadow-xs",
        danger: "bg-danger text-white hover:opacity-90 shadow-sm",
        link: "text-primary hover:underline underline-offset-4",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-7 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
