"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "border border-white/[0.08] bg-[#11111a] text-zinc-100 shadow-2xl",
          title: "text-sm font-medium",
          description: "text-xs text-zinc-400",
          actionButton:
            "bg-indigo-500 text-white hover:bg-indigo-400 text-xs px-2.5 py-1 rounded-md",
          cancelButton:
            "text-zinc-400 hover:text-zinc-200 text-xs px-2.5 py-1",
        },
      }}
    />
  );
}
