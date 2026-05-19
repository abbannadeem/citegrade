import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <span className="text-base font-semibold tracking-tight">
                Citegrade
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The 100-point AI SEO audit. Built for the LLM era.
            </p>
          </div>
          <Col title="Product" links={[
            { href: "/pricing", label: "Pricing" },
            { href: "/leaderboard", label: "Leaderboard" },
            { href: "/docs", label: "Methodology" },
            { href: "/changelog", label: "Changelog" },
          ]} />
          <Col title="Resources" links={[
            { href: "/llms.txt", label: "llms.txt" },
            { href: "/llms-full.txt", label: "llms-full.txt" },
            { href: "/robots.txt", label: "robots.txt" },
            { href: "/sitemap.xml", label: "sitemap.xml" },
          ]} />
          <Col title="Company" links={[
            { href: "/about", label: "About" },
            { href: "/legal/privacy", label: "Privacy" },
            { href: "/legal/terms", label: "Terms" },
            { href: "https://github.com/AbbanNadeem-SQA/citegrade", label: "GitHub" },
          ]} />
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Citegrade · Built in public.</p>
          <p className="font-mono">
            Last updated{" "}
            <time dateTime={new Date().toISOString().slice(0, 10)}>
              {new Date().toISOString().slice(0, 10)}
            </time>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Col({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
