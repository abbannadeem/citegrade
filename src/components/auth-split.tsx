import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const AUTH_IMG =
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1100&q=80&auto=format&fit=crop";

export function AuthSplit({
  side = "right",
  children,
}: {
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  const visual = (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-fg text-bg">
      <Image
        src={AUTH_IMG}
        alt="A quiet workspace — the focused state Citegrade is built for"
        fill
        sizes="50vw"
        className="object-cover opacity-90"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/40 to-fg/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-fg/80 via-transparent to-transparent" />
      <div className="relative">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Citegrade
          </span>
        </Link>
      </div>
      <div className="relative">
        <p className="text-2xl font-medium leading-snug text-white tracking-[-0.02em] max-w-md">
          “Most sites we audit fail the basics — no llms.txt, broken schema,
          zero E-E-A-T. The score makes the gap visible.”
        </p>
        <p className="mt-4 text-sm text-white/70 font-mono">
          — Abban Nadeem, builder
        </p>
      </div>
    </div>
  );

  const form = (
    <div className="flex items-center justify-center p-6 lg:p-12 bg-bg">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {side === "left" ? (
        <>
          {visual}
          {form}
        </>
      ) : (
        <>
          {form}
          {visual}
        </>
      )}
    </main>
  );
}
