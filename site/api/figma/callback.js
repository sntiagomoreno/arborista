// Figma redirects here after the user approves. We don't exchange the code
// here: it's handed to the app, which exchanges it together with its PKCE
// verifier, so a code intercepted on its way back is useless on its own.
export function GET(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();
  for (const key of ["code", "state", "error"]) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }
  const appUrl = `arborista://oauth/callback?${params}`;
  const failed = !params.has("code");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Arborista</title>
<link rel="icon" href="/icon.png" />
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #1f1f1f; color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; text-align: center; padding: 0 16px; }
  main { display: flex; flex-direction: column; align-items: center; gap: 12px; max-width: 360px; }
  img { width: 56px; height: 56px; margin-bottom: 8px; }
  h1 { font-size: 18px; font-weight: 500; margin: 0; }
  p { font-size: 14px; color: #9d9d9d; margin: 0; line-height: 1.5; }
  a { margin-top: 12px; padding: 10px 18px; border-radius: 12px; background: #ecf6af; color: #1f1f1f;
    font-weight: 500; font-size: 14px; text-decoration: none; }
</style>
</head>
<body>
<main>
  <img src="/icon.png" alt="" />
  ${failed
    ? `<h1>Sign-in didn't complete</h1><p>Figma didn't return an authorization. Go back to Arborista and try again.</p>`
    : `<h1>Returning to Arborista…</h1><p>If nothing happens, open the app with the button below. You can close this tab afterwards.</p>
  <a href="${appUrl}">Open Arborista</a>`}
</main>
${failed ? "" : `<script>window.location.href = ${JSON.stringify(appUrl)};</script>`}
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
