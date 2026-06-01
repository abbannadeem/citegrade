"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Home,
  LayoutDashboard,
  Search,
  Trophy,
  CreditCard,
  FileText,
  Settings,
  Scale,
  Newspaper,
  BookOpen,
  Plus,
} from "lucide-react";

const ITEMS = [
  { group: "Navigate", id: "home", label: "Go to home", href: "/", icon: Home },
  { group: "Navigate", id: "dash", label: "Open dashboard", href: "/dashboard", icon: LayoutDashboard },
  { group: "Navigate", id: "lead", label: "Open leaderboard", href: "/leaderboard", icon: Trophy },
  { group: "Navigate", id: "price", label: "View pricing", href: "/pricing", icon: CreditCard },
  { group: "Navigate", id: "docs", label: "Methodology / Docs", href: "/docs", icon: BookOpen },
  { group: "Navigate", id: "chg", label: "Changelog", href: "/changelog", icon: Newspaper },
  { group: "Navigate", id: "about", label: "About", href: "/about", icon: FileText },
  { group: "Navigate", id: "legal", label: "Legal", href: "/legal/privacy", icon: Scale },
  { group: "Actions", id: "new", label: "Run a new audit", href: "/", icon: Plus },
  { group: "Actions", id: "set", label: "Account settings", href: "/dashboard/settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-line bg-surface shadow-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command palette" loop>
          <div className="flex items-center gap-2 px-4 border-b border-line">
            <Search className="w-4 h-4 text-subtle" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search…"
              className="flex-1 h-12 bg-transparent text-sm text-fg placeholder:text-subtle outline-none"
            />
            <kbd className="text-[10px] text-subtle font-mono px-1.5 py-0.5 rounded border border-line">
              Esc
            </kbd>
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-subtle">
              No results found.
            </Command.Empty>
            {["Navigate", "Actions"].map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-subtle"
              >
                {ITEMS.filter((i) => i.group === group).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.href}`}
                      onSelect={() => go(item.href)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted cursor-pointer data-[selected=true]:bg-surface2 data-[selected=true]:text-fg"
                    >
                      <Icon className="w-4 h-4 text-subtle" />
                      {item.label}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
          <div className="px-4 py-2 border-t border-line flex items-center justify-between text-[10px] text-subtle font-mono">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
