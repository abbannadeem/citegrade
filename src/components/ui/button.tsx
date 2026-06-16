import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-tight transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] outline-none",
  {
    variants: {
      variant: {
        // Solid ink — the editorial default action
        primary:
          "bg-fg text-primary-fg hover:bg-primary-hover shadow-xs",
        // The one accent — signal-lime fill with ink text, reserved for hero/key CTAs
        signal:
          "bg-signal text-signal-fg hover:brightness-[0.96] shadow-xs font-semibold",
        secondary:
          "bg-surface text-fg border border-line-strong hover:bg-surface2 shadow-xs",
        ghost: "text-muted hover:text-fg hover:bg-surface2",
        outline:
          "border border-line-strong text-fg hover:bg-surface2 shadow-xs",
        danger: "bg-danger text-white hover:opacity-90 shadow-sm",
        link: "text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg",
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
