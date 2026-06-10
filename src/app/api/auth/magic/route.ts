import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { consumeMagicLink } from "@/app/(auth)/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) redirect("/sign-in?error=missing_token");
  let dest: string;
  try {
    dest = await consumeMagicLink(token!);
  } catch {
    redirect("/sign-in?error=link_invalid");
  }
  redirect(dest!);
}
