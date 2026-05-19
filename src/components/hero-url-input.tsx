"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { startAudit, type AuditFormState } from "@/app/actions";
import { motion } from "motion/react";

const initial: AuditFormState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm tracking-tight shadow-[0_0_24px_rgba(94,92,230,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.97]"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Scanning
        </>
      ) : (
        <>
          Audit <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export function HeroUrlInput() {
  const [state, formAction] = useActionState(startAudit, initial);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full"
    >
      <form action={formAction} className="relative">
        <input
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="https://your-site.com"
          aria-label="Website URL to audit"
          className="w-full h-16 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl pl-5 pr-32 font-mono text-base text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-[0_0_40px_rgba(94,92,230,0.08)] transition-all"
        />
        <Submit />
      </form>
      {state.status === "error" ? (
        <p className="mt-3 text-sm text-rose-400 font-mono" role="alert">
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-xs text-zinc-500">
          Free · no signup · 100-point score in under 30 seconds. We scan your
          homepage,{" "}
          <code className="font-mono text-zinc-400">/llms.txt</code>,{" "}
          <code className="font-mono text-zinc-400">/robots.txt</code>, and{" "}
          <code className="font-mono text-zinc-400">/sitemap.xml</code>.
        </p>
      )}
    </motion.div>
  );
}
