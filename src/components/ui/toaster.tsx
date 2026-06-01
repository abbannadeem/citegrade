"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={(theme as "light" | "dark") || "light"}
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "border border-line bg-surface text-fg shadow-pop",
          title: "text-sm font-medium",
          description: "text-xs text-muted",
        },
      }}
    />
  );
}
