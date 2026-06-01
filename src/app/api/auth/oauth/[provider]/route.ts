import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authorizeUrl, getProvider, type OAuthProvider } from "@/lib/oauth";
import { randomToken } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const p = getProvider(provider);
  if (!p) redirect("/sign-in?error=unknown_provider");
  const state = randomToken(16);
  const c = await cookies();
  c.set("cg_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  const url = authorizeUrl(provider as OAuthProvider, state);
  if (!url) redirect("/sign-in?error=provider_not_configured");
  redirect(url!);
}
