import { REDIRECT_URI, corsHeaders, figmaOAuthRequest, json } from "../_lib/figma.js";

export function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

// Exchanges an authorization code (plus the app's PKCE verifier) for tokens.
export async function POST(request) {
  const { code, code_verifier } = await request.json().catch(() => ({}));
  if (!code || !code_verifier) {
    return json(request, { error: "Missing code or code_verifier" }, 400);
  }

  const { ok, status, data } = await figmaOAuthRequest("token", {
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier,
    grant_type: "authorization_code",
  });
  if (!ok) return json(request, { error: "Token exchange failed" }, status);

  return json(request, {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  });
}
