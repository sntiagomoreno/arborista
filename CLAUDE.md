# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development**: `npm run dev` (frontend) or `npm run tauri dev` (full Tauri app)
- **Build project**: `npm run build` (creates production build in `/dist`)
- **Preview build**: `npm run preview` (serves production build locally)
- **Tauri commands**: `npm run tauri <command>` (build, dev, etc.)

## Architecture Overview

This is a **Tauri + React + TypeScript** desktop application called "Arborista" - a Figma branch audit tool that helps visualize and manage Figma project files and their branches.

### Frontend (React)
- **Main app**: `src/App.tsx` - Currently contains core logic but will be refactored into smaller components
- **Components**: `src/components/` - Reusable UI components (currently has Field.tsx for form inputs using Base UI)
- **Store**: `src/store.ts` - Tauri persistent storage for tokens and project IDs
- **Entry point**: `src/main.tsx` - React root setup

### Backend (Rust/Tauri)
- **Main**: `src-tauri/src/main.rs` - Entry point
- **Core logic**: `src-tauri/src/lib.rs` - Tauri app setup with system tray functionality
- **Configuration**: `src-tauri/tauri.conf.json` - App settings and build config

### Key Features
- **Figma API Integration**: Fetches project files and branch data using user's access token
- **Local Storage**: Securely stores Figma tokens and project IDs using Tauri store plugin
- **System Tray App**: Designed as a menubar/tray application (360x600px, non-resizable)
- **Branch Visualization**: Displays files in Figma projects with their branch count and last modified dates

### Dependencies
- **Frontend**: React 19, @base-ui-components for form fields
- **Backend**: Tauri v2 with plugins for storage and system integration
- **Build**: Vite for bundling, TypeScript for type safety

### App Behavior
- Window hides on close (doesn't quit)
- Tray icon click toggles window visibility
- Window positioned under tray icon when shown
- Transparent window background
- Uses Tauri store for persistent data across sessions

### Development Notes
- Frontend runs on localhost:1420 during development
- Tauri expects fixed ports (1420 for dev server, 1421 for HMR)
- Uses strict TypeScript configuration with linting rules
- No test framework currently configured