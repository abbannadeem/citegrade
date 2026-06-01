import { siteUrl } from "./site";

export type OAuthProvider = "github" | "google";

interface ProviderConfig {
  id: OAuthProvider;
  label: string;
  clientId?: string;
  clientSecret?: string;
  authorizeUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
}

function configs(): Record<OAuthProvider, ProviderConfig> {
  return {
    github: {
      id: "github",
      label: "GitHub",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorizeUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userUrl: "https://api.github.com/user",
      scope: "read:user user:email",
    },
    google: {
      id: "google",
      label: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
      scope: "openid email profile",
    },
  };
}

export function getProvider(id: string): ProviderConfig | null {
  const all = configs();
  return (all as Record<string, ProviderConfig>)[id] ?? null;
}

export function isEnabled(id: OAuthProvider): boolean {
  const p = getProvider(id);
  return !!(p && p.clientId && p.clientSecret);
}

export function enabledProviders(): { id: OAuthProvider; label: string }[] {
  return (["github", "google"] as OAuthProvider[])
    .filter(isEnabled)
    .map((id) => ({ id, label: configs()[id].label }));
}

export function redirectUri(id: OAuthProvider): string {
  return siteUrl(`/api/auth/oauth/${id}/callback`);
}

export function authorizeUrl(id: OAuthProvider, state: string): string | null {
  const p = getProvider(id);
  if (!p || !p.clientId) return null;
  const params = new URLSearchParams({
    client_id: p.clientId,
    redirect_uri: redirectUri(id),
    scope: p.scope,
    state,
    response_type: "code",
  });
  return `${p.authorizeUrl}?${params.toString()}`;
}

export interface OAuthProfile {
  email: string;
  name?: string;
  image?: string;
}

export async function exchangeAndFetch(
  id: OAuthProvider,
  code: string,
): Promise<OAuthProfile | null> {
  const p = getProvider(id);
  if (!p || !p.clientId || !p.clientSecret) return null;

  const tokenRes = await fetch(p.tokenUrl, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: p.clientId,
      client_secret: p.clientSecret,
      code,
      redirect_uri: redirectUri(id),
      grant_type: "authorization_code",
    }),
  });
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenJson.access_token;
  if (!accessToken) return null;

  const userRes = await fetch(p.userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "User-Agent": "Citegrade",
    },
  });
  const profile = (await userRes.json()) as Record<string, unknown>;

  if (id === "github") {
    let email = (profile.email as string) || "";
    if (!email) {
      // GitHub may not expose a public email — fetch from the emails endpoint
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Citegrade",
        },
      });
      const emails = (await emailsRes.json()) as {
        email: string;
        primary: boolean;
        verified: boolean;
      }[];
      const primary = Array.isArray(emails)
        ? emails.find((e) => e.primary && e.verified) || emails[0]
        : null;
      email = primary?.email || "";
    }
    if (!email) return null;
    return {
      email,
      name: (profile.name as string) || (profile.login as string),
      image: profile.avatar_url as string,
    };
  }

  // google
  const email = profile.email as string;
  if (!email) return null;
  return {
    email,
    name: profile.name as string,
    image: profile.picture as string,
  };
}
