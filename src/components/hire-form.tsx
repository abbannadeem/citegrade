"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2, Send } from "lucide-react";
import {
  submitHireRequest,
  type HireFormState,
} from "@/app/r/[slug]/hire-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: HireFormState = { status: "idle" };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          <Send className="w-4 h-4" /> {label}
        </>
      )}
    </Button>
  );
}

interface Props {
  reportId: string;
  siteHost: string;
  currentScore: number;
  potentialScore: number;
}

export function HireForm({
  reportId,
  siteHost,
  currentScore,
  potentialScore,
}: Props) {
  const [state, formAction] = useActionState(submitHireRequest, initial);
  const [intent, setIntent] = useState<"quote" | "consult">("quote");

  if (state.status === "ok") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-soft p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-success/15 mx-auto flex items-center justify-center mb-3">
          <Check className="w-6 h-6 text-success" />
        </div>
        <p className="text-fg font-semibold">Got it — reply within 24 hours</p>
        <p className="text-sm text-muted mt-1">
          Check your inbox for the quote.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="siteHost" value={siteHost} />
      <input type="hidden" name="currentScore" value={currentScore} />
      <input type="hidden" name="potentialScore" value={potentialScore} />
      <input type="hidden" name="intent" value={intent} />

      <div className="grid sm:grid-cols-2 gap-2 mb-1">
        <button
          type="button"
          onClick={() => setIntent("quote")}
          className={`h-9 px-3 rounded-md text-xs font-medium border transition-colors ${
            intent === "quote"
              ? "bg-primary text-primary-fg border-primary"
              : "bg-surface border-line text-muted hover:text-fg"
          }`}
        >
          Get a fixed quote
        </button>
        <button
          type="button"
          onClick={() => setIntent("consult")}
          className={`h-9 px-3 rounded-md text-xs font-medium border transition-colors ${
            intent === "consult"
              ? "bg-primary text-primary-fg border-primary"
              : "bg-surface border-line text-muted hover:text-fg"
          }`}
        >
          Free 15-min call
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        <Input
          name="name"
          placeholder="Your name (optional)"
          autoComplete="name"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder={
          intent === "consult"
            ? "Anything I should know before the call? (optional)"
            : "What matters most to you? Timeline, budget, anything else (optional)"
        }
        className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-colors resize-none"
      />
      {state.status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}
      <Submit
        label={intent === "consult" ? "Book free 15-min call" : "Get my quote"}
      />
      <p className="text-[11px] text-subtle text-center pt-1">
        You&apos;ll get a reply within 24 hours. No spam.
      </p>
    </form>
  );
}
