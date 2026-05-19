import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#5e5ce6] text-white hover:bg-[#7270ff] shadow-[0_0_0_1px_rgba(94,92,230,0.4)] hover:shadow-[0_0_20px_rgba(94,92,230,0.35)]",
        secondary:
          "bg-white/[0.06] text-zinc-100 hover:bg-white/[0.1] border border-white/[0.08]",
        ghost: "text-zinc-300 hover:text-white hover:bg-white/[0.06]",
        outline:
          "border border-white/[0.12] text-zinc-100 hover:border-white/25 hover:bg-white/[0.04]",
        danger:
          "bg-rose-500/90 text-white hover:bg-rose-500 border border-rose-400/30",
        link: "text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline",
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
