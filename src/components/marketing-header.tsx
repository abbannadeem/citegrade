"use client";

import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isAuthed: boolean;
}

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function MarketingHeader({ isAuthed }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070b]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Citegrade
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {isAuthed ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 space-y-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block text-zinc-300 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/[0.06] flex gap-2">
            {isAuthed ? (
              <Button asChild className="flex-1">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
