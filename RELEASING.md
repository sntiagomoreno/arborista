# Releasing Arborista

Releases are built, signed, notarized and published to GitHub Releases by
`.github/workflows/release.yml` whenever a `v*` tag is pushed. The signing
certificate lives only in GitHub Actions secrets, never in the repo.

## Cutting a release

```bash
npm version patch   # or minor / major
git push --follow-tags
```

`npm version` bumps `package.json` (the single source of truth, which
`tauri.conf.json` reads), syncs `src-tauri/Cargo.toml` and `Cargo.lock` via
`scripts/sync-version.mjs`, then commits and creates the `vX.Y.Z` tag.
The workflow fails if the tag and `package.json` disagree. It creates a
**draft** release; review it on GitHub and click Publish.

## One-time setup: repository secrets

Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `APPLE_CERTIFICATE` | Base64 of your "Developer ID Application" `.p12`: `base64 -i cert.p12 \| pbcopy` |
| `APPLE_CERTIFICATE_PASSWORD` | Password you set when exporting the `.p12` |
| `APPLE_SIGNING_IDENTITY` | e.g. `Developer ID Application: Your Name (TEAMID)` (`security find-identity -v -p codesigning`) |
| `APPLE_ID` | Apple ID email used for notarization |
| `APPLE_PASSWORD` | App-specific password from appleid.apple.com |
| `APPLE_TEAM_ID` | 10-character team ID |
| `TAURI_SIGNING_PRIVATE_KEY` | Updater private key (`~/.arborista-signing/updater.key`). **Never lose it**: installed apps only accept updates signed with it. |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Password for the updater key |

## Auto-update

The workflow publishes `latest.json` with each release. The app checks it at
launch and when the window regains focus (at most hourly), and Settings →
App updates shows the install button. Draft releases are ignored, so an update
reaches users only after you publish the release.
