import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { exchangeAndFetch, getProvider, type OAuthProvider } from "@/lib/oauth";
import { signInOrCreateByEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  if (!getProvider(provider)) redirect("/sign-in?error=unknown_provider");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const c = await cookies();
  const savedState = c.get("cg_oauth_state")?.value;
  c.delete("cg_oauth_state");

  if (!code || !state || state !== savedState) {
    redirect("/sign-in?error=oauth_state");
  }

  const profile = await exchangeAndFetch(provider as OAuthProvider, code!);
  if (!profile?.email) {
    redirect("/sign-in?error=oauth_failed");
  }

  await signInOrCreateByEmail(profile!.email, profile!.name);
  redirect("/dashboard");
}
