"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function DashboardSearch({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/dashboard/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className="relative w-full max-w-md"
    >
      <Search className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search your sites and audits…"
        className="w-full h-10 rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </form>
  );
}
