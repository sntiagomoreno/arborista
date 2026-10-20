<p align="center">
  <img src="public/icon.png" alt="Arborista" width="80" height="80" />
</p>

<h1 align="center">Arborista</h1>

<p align="center">
  A macOS app that audits your Figma branches.
</p>

Arborista gives you a quick overview of the files in your Figma folders (previously projects) and the branches hanging off them: how many branches each file has, who made them, and when they were last updated. Use it to spot stale branches and keep your design files tidy.

- Add one or more Figma folders by ID or URL and switch between them
- See each file's branches, authors and last-modified dates at a glance
- Your Figma access token and folders are stored locally on your machine
- Updates itself: new versions are announced in Settings

## Install

Download the latest `.dmg` from the [Releases](../../releases) page.

## Development

```bash
npm install
npm run tauri dev
```

Releases are built, signed and published by GitHub Actions; see [RELEASING.md](RELEASING.md).

Built with [Tauri](https://tauri.app), React and TypeScript.
