import { REDIRECT_URI, SCOPES, credentials } from "../_lib/figma.js";

// Entry point the desktop app opens in the browser. Keeps the client ID on the
// server so the app only needs to know this URL.
export function GET(request) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const codeChallenge = url.searchParams.get("code_challenge");
  if (!state || !codeChallenge) {
    return new Response("Missing state or code_challenge", { status: 400 });
  }

  const authorize = new URL("https://www.figma.com/oauth");
  authorize.search = new URLSearchParams({
    client_id: credentials().clientId,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    state,
    response_type: "code",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  }).toString();

  return Response.redirect(authorize.toString(), 302);
}
