"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  signInAction,
  signUpAction,
  type AuthState,
} from "@/app/(auth)/actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Working…" : label}
    </Button>
  );
}

export function AuthForm({
  mode,
  next,
  claim,
}: {
  mode: "sign-in" | "sign-up";
  next?: string;
  claim?: string;
}) {
  const action = mode === "sign-up" ? signUpAction : signInAction;
  const [state, formAction] = useActionState<AuthState, FormData>(
    action,
    undefined,
  );
  return (
    <form action={formAction} className="space-y-3">
      {next && <input type="hidden" name="next" value={next} />}
      {claim && <input type="hidden" name="claim" value={claim} />}
      {mode === "sign-up" && (
        <div>
          <label htmlFor="name" className="block text-xs text-muted mb-1.5">
            Name
          </label>
          <Input id="name" name="name" placeholder="Jane Doe" autoComplete="name" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-xs text-muted mb-1.5">
          Email
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus={mode === "sign-in"}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-muted mb-1.5"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          placeholder={mode === "sign-up" ? "At least 8 characters" : "••••••••"}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      )}
      <Submit label={mode === "sign-up" ? "Create account" : "Sign in"} />
      <p className="text-xs text-muted text-center pt-2">
        {mode === "sign-up" ? (
          <>
            Already have an account?{" "}
            <Link
              href={`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href={`/sign-up${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-primary hover:underline"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
