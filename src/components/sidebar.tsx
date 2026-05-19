"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  GitCompare,
  Settings,
  Trophy,
  Plus,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sites", label: "Sites", icon: Globe },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompare },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-white/[0.06] bg-[#09090f] transition-all duration-200 hidden md:flex md:flex-col",
        collapsed ? "w-[60px]" : "w-[220px]",
      )}
    >
      <div className="flex items-center justify-between h-14 px-3 border-b border-white/[0.06]">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-1 group",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="w-7 h-7 shrink-0 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">
              Citegrade
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        )}
      </div>

      <div className="p-3">
        <Button asChild size={collapsed ? "icon" : "md"} className="w-full">
          <Link href="/" aria-label="Run a new audit">
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New audit</span>}
          </Link>
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/[0.06] text-[10px] font-mono text-zinc-600">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <span>v1.0 · beta</span>
            <kbd className="px-1.5 py-0.5 rounded border border-white/[0.08]">
              ⌘K
            </kbd>
          </div>
        ) : (
          <kbd className="px-1 py-0.5 rounded border border-white/[0.08] text-[9px]">
            ⌘K
          </kbd>
        )}
      </div>
    </aside>
  );
}
