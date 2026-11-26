import { openUrl } from "@tauri-apps/plugin-opener";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { getCurrentWindow } from "@tauri-apps/api/window";

const AUTH_API = "https://arborista.santiagomoreno.co/api/figma";
const SIGN_IN_TIMEOUT_MS = 10 * 60 * 1000;

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString() {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return base64Url(new Uint8Array(digest));
}

async function postJson<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${AUTH_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${path} failed: ${response.status}`);
  return response.json();
}

function toTokens(data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}): OAuthTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

let cancelPending: (() => void) | null = null;

export function cancelSignIn() {
  cancelPending?.();
}

// Opens Figma's consent page in the default browser and resolves once the
// browser hands the authorization code back through the arborista:// link.
export async function signInWithFigma(): Promise<OAuthTokens> {
  cancelSignIn();
  const state = randomString();
  const verifier = randomString();
  const challenge = await sha256(verifier);

  const code = await new Promise<string>((resolve, reject) => {
    let unlisten: (() => void) | undefined;
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      unlisten?.();
      cancelPending = null;
      fn();
    };
    const timer = setTimeout(
      () => finish(() => reject(new Error("Sign-in timed out"))),
      SIGN_IN_TIMEOUT_MS,
    );
    cancelPending = () => finish(() => reject(new Error("Sign-in cancelled")));

    onOpenUrl((urls) => {
      for (const raw of urls) {
        const url = new URL(raw);
        if (
          url.protocol !== "arborista:" ||
          url.searchParams.get("state") !== state
        )
          continue;
        const received = url.searchParams.get("code");
        finish(() =>
          received
            ? resolve(received)
            : reject(new Error("Figma didn't authorize Arborista")),
        );
        return;
      }
    })
      .then((fn) => {
        if (done) return fn();
        unlisten = fn;
        return openUrl(
          `${AUTH_API}/login?${new URLSearchParams({ state, code_challenge: challenge })}`,
        );
      })
      .catch((err) => finish(() => reject(err)));
  });

  const window = getCurrentWindow();
  await window.show();
  await window.setFocus();

  return toTokens(await postJson("token", { code, code_verifier: verifier }));
}

export async function refreshFigmaTokens(
  refreshToken: string,
): Promise<OAuthTokens> {
  const data = await postJson<{ access_token: string; expires_in: number }>(
    "refresh",
    {
      refresh_token: refreshToken,
    },
  );
  return toTokens({ ...data, refresh_token: refreshToken });
}
