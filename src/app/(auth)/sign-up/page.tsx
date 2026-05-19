import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "../actions";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sign up",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; claim?: string }>;
}) {
  const { next, claim } = await searchParams;
  if (await getCurrentUser()) {
    redirect(next || "/dashboard");
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-aurora">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 mb-10 group justify-center"
        >
          <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Citegrade
          </span>
        </Link>

        <div className="rounded-xl border border-white/[0.08] bg-[#0d0d14]/80 backdrop-blur-xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track audits over time. Monitor scores. Free forever for 1 site.
          </p>

          <form action={signInAction} className="mt-6 space-y-3">
            {next && <input type="hidden" name="next" value={next} />}
            {claim && <input type="hidden" name="claim" value={claim} />}
            <div>
              <label
                htmlFor="name"
                className="block text-xs text-zinc-400 mb-1.5"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-zinc-400 mb-1.5"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-xs text-zinc-500 text-center">
            Already have an account?{" "}
            <Link
              href={`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-indigo-300 hover:text-indigo-200"
            >
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-[10px] text-zinc-600 text-center">
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
