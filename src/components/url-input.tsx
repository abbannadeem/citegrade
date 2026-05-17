"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { startAudit, type AuditFormState } from "@/app/actions";

const initial: AuditFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-14 px-6 rounded-lg bg-emerald-500 text-zinc-950 font-semibold tracking-tight transition-colors hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed shrink-0"
    >
      {pending ? "Scanning…" : "Audit"}
    </button>
  );
}

export function UrlInput() {
  const [state, formAction] = useActionState(startAudit, initial);
  return (
    <form action={formAction} className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoFocus
          placeholder="https://your-site.com"
          aria-label="Website URL to audit"
          className="h-14 flex-1 rounded-lg bg-zinc-900/80 border border-zinc-800 px-4 font-mono text-base text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <SubmitButton />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-rose-400" role="alert">
          {state.message}
        </p>
      )}
      <p className="text-xs text-zinc-500">
        Audits typically complete in 5–15 seconds. We fetch your homepage,{" "}
        <code className="font-mono text-zinc-400">/llms.txt</code>,{" "}
        <code className="font-mono text-zinc-400">/robots.txt</code>, and{" "}
        <code className="font-mono text-zinc-400">/sitemap.xml</code>. No login required.
      </p>
    </form>
  );
}
