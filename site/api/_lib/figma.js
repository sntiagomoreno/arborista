// Shared helpers for the Figma OAuth functions. The client secret only ever
// lives here (as a Vercel environment variable), never in the desktop app.

export const REDIRECT_URI = "https://arborista.santiagomoreno.co/api/figma/callback";
export const SCOPES = [
  "current_user:read",
  "file_content:read",
  "file_metadata:read",
  "file_versions:read",
  "folders:read",
];

// Origins the desktop app's webview makes requests from.
const ALLOWED_ORIGINS = ["tauri://localhost", "http://tauri.localhost", "http://localhost:1420"];

export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...corsHeaders(request) },
  });
}

export function credentials() {
  const { FIGMA_CLIENT_ID, FIGMA_CLIENT_SECRET } = process.env;
  if (!FIGMA_CLIENT_ID || !FIGMA_CLIENT_SECRET) {
    throw new Error("FIGMA_CLIENT_ID and FIGMA_CLIENT_SECRET must be set");
  }
  return { clientId: FIGMA_CLIENT_ID, clientSecret: FIGMA_CLIENT_SECRET };
}

// POSTs a form to Figma's OAuth API with HTTP Basic client authentication.
export async function figmaOAuthRequest(path, params) {
  const { clientId, clientSecret } = credentials();
  const response = await fetch(`https://api.figma.com/v1/oauth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams(params),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}
