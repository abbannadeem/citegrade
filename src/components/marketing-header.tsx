"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandMark size={24} />
          <span className="text-[15px] font-semibold tracking-tight text-fg">
            Citegrade
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13px]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-muted hover:text-fg transition-colors"
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
          className="md:hidden p-2 -mr-2 text-muted hover:text-fg"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-line px-6 py-4 space-y-3 bg-bg">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block text-[13px] text-muted hover:text-fg"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-line flex gap-2">
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
