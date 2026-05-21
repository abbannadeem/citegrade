import Link from "next/link";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; claim?: string }>;
}) {
  const { next, claim } = await searchParams;
  if (await getCurrentUser()) redirect(next || "/dashboard");
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-aurora">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          <span className="text-base font-semibold tracking-tight">Citegrade</span>
        </Link>
        <div className="rounded-xl border border-white/[0.08] bg-[#0d0d14]/80 backdrop-blur-xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 mb-6 text-sm text-zinc-400">
            Sign in to your Citegrade account.
          </p>
          <AuthForm mode="sign-in" next={next} claim={claim} />
        </div>
      </div>
    </main>
  );
}
