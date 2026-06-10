import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle",
        className,
      )}
    >
      {children}
    </p>
  );
}
