import { corsHeaders, figmaOAuthRequest, json } from "../_lib/figma.js";

export function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

// Trades a refresh token for a new access token. Figma keeps the refresh
// token valid, so only the access token and its lifetime come back.
export async function POST(request) {
  const { refresh_token } = await request.json().catch(() => ({}));
  if (!refresh_token) return json(request, { error: "Missing refresh_token" }, 400);

  const { ok, status, data } = await figmaOAuthRequest("refresh", { refresh_token });
  if (!ok) return json(request, { error: "Refresh failed" }, status);

  return json(request, { access_token: data.access_token, expires_in: data.expires_in });
}
