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
      className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-5 rounded-lg bg-signal hover:brightness-[0.96] text-signal-fg font-semibold text-sm tracking-tight transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Scanning
        </>
      ) : (
        <>
          Run audit <ArrowRight className="w-4 h-4" />
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
          className="w-full h-16 rounded-xl border border-line-strong bg-surface pl-5 pr-36 font-mono text-base text-fg placeholder:text-subtle focus:border-fg focus:outline-none shadow-card transition-colors"
        />
        <Submit />
      </form>
      {state.status === "error" ? (
        <p className="mt-3 text-sm text-danger font-mono" role="alert">
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted">
          Free · no signup · 100-point score in under 30 seconds. We scan your
          homepage, <code className="font-mono text-fg">/llms.txt</code>,{" "}
          <code className="font-mono text-fg">/robots.txt</code>, and{" "}
          <code className="font-mono text-fg">/sitemap.xml</code>.
        </p>
      )}
    </motion.div>
  );
}
