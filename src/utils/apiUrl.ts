export const FIGMA_API_URL = "https://api.figma.com/v1";
export const FIGMA_API_URL_V2 = "https://api.figma.com/v2";

// Personal access tokens go in X-Figma-Token; OAuth tokens must be sent as a
// Bearer token. The stored-data context registers the active OAuth token.
let oauthAccessToken: string | null = null;

export function registerOAuthToken(token: string | null) {
  oauthAccessToken = token;
}

export function figmaHeaders(accessToken: string): Record<string, string> {
  return accessToken === oauthAccessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { "X-Figma-Token": accessToken };
}
