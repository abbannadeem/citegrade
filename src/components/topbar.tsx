"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";
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
import { signOutAction } from "@/app/(auth)/actions";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#09090f]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span>Personal workspace</span>
      </div>
      <div className="flex items-center gap-2">
        <SearchHint />
        <button
          aria-label="Notifications"
          className="p-2 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.06] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>Signed in</DropdownMenuLabel>
            <div className="px-2.5 pb-2">
              <p className="text-sm text-zinc-200 truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              <div className="mt-2">
                <Badge variant={user.plan === "pro" ? "primary" : "outline"}>
                  {user.plan === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="w-3.5 h-3.5" /> Account settings
              </Link>
            </DropdownMenuItem>
            {user.plan !== "pro" && (
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="cursor-pointer text-indigo-300">
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
      className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-colors"
    >
      <span>Search…</span>
      <kbd className="font-mono text-[10px] px-1 py-0.5 rounded border border-white/[0.08] text-zinc-500">
        ⌘K
      </kbd>
    </button>
  );
}
