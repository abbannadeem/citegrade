"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Settings, ShieldCheck } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/app/(auth)/actions";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="h-14 border-b border-line bg-bg/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>Personal workspace</span>
      </div>
      <div className="flex items-center gap-2">
        <SearchHint />
        <ThemeToggle />
        <button
          aria-label="Notifications"
          className="p-2 rounded-md text-subtle hover:text-fg hover:bg-surface2 transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface2 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3 h-3 text-subtle" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>Signed in</DropdownMenuLabel>
            <div className="px-2.5 pb-2">
              <p className="text-sm text-fg truncate">{user.name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
              <div className="mt-2">
                <Badge variant={user.plan !== "free" ? "primary" : "outline"}>
                  {user.plan === "free" ? "Free" : user.plan === "pro" ? "Pro" : "Agency"}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="w-3.5 h-3.5" /> Account settings
              </Link>
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer text-primary">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin panel
                </Link>
              </DropdownMenuItem>
            )}
            {user.plan === "free" && (
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="cursor-pointer text-primary">
                  Upgrade to Pro
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function SearchHint() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }),
        )
      }
      className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md border border-line bg-surface text-xs text-subtle hover:text-fg hover:border-line-strong transition-colors"
    >
      <span>Search…</span>
      <kbd className="font-mono text-[10px] px-1 py-0.5 rounded border border-line">
        ⌘K
      </kbd>
    </button>
  );
}
