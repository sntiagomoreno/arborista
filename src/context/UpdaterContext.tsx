import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "error";

interface UpdaterContextValue {
  status: UpdateStatus;
  currentVersion: string;
  newVersion: string | null;
  notes: string | null;
  progress: number | null;
  error: string | null;
  updateAvailable: boolean;
  checkForUpdates: (silent?: boolean) => Promise<void>;
  installUpdate: () => Promise<void>;
}

const UpdaterContext = createContext<UpdaterContextValue | null>(null);

const CHECK_INTERVAL_MS = 60 * 60 * 1000;
const DEMO = import.meta.env.VITE_DEMO_MODE === "true";
const enabled = isTauri() && !DEMO;

export function UpdaterProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [currentVersion, setCurrentVersion] = useState("");
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const update = useRef<Update | null>(null);
  const lastCheck = useRef(0);

  const checkForUpdates = useCallback(async (silent = false) => {
    if (DEMO) {
      setStatus("checking");
      await new Promise((r) => setTimeout(r, 800));
      setStatus("available");
      return;
    }
    if (!enabled) return;
    lastCheck.current = Date.now();
    setStatus("checking");
    setError(null);
    try {
      const result = await check();
      update.current = result;
      if (result) {
        setNewVersion(result.version);
        setNotes(result.body ?? null);
        setStatus("available");
      } else {
        setStatus("idle");
      }
    } catch (e) {
      // No release manifest published (404 / invalid JSON) just means there is
      // nothing newer; only real failures (offline, etc.) are worth surfacing,
      // and never for the automatic background checks.
      if (silent || /valid release JSON/i.test(String(e))) {
        setStatus("idle");
        return;
      }
      setError("Couldn't check for updates. Try again later.");
      setStatus("error");
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (DEMO) {
      setStatus("downloading");
      for (let p = 0; p <= 100; p += 5) {
        setProgress(p);
        await new Promise((r) => setTimeout(r, 120));
      }
      setStatus("idle");
      return;
    }
    if (!update.current) return;
    setStatus("downloading");
    setProgress(0);
    setError(null);
    let total = 0;
    let received = 0;
    try {
      await update.current.downloadAndInstall((event) => {
        if (event.event === "Started") total = event.data.contentLength ?? 0;
        if (event.event === "Progress") {
          received += event.data.chunkLength;
          if (total) setProgress(Math.round((received / total) * 100));
        }
      });
      await relaunch();
    } catch {
      setError("Update failed to install. Try again later.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (DEMO) {
      setCurrentVersion("0.1.3");
      setNewVersion("0.2.0");
      setNotes("Adds in-app updates and a refreshed settings page.");
      setStatus("available");
      return;
    }
    if (!enabled) return;
    getVersion().then(setCurrentVersion);
    checkForUpdates(true);
    // The window is hidden rather than closed, so re-check on focus.
    const onFocus = () => {
      if (Date.now() - lastCheck.current > CHECK_INTERVAL_MS)
        checkForUpdates(true);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkForUpdates]);

  return (
    <UpdaterContext.Provider
      value={{
        status,
        currentVersion,
        newVersion,
        notes,
        progress,
        error,
        updateAvailable: status === "available" || status === "downloading",
        checkForUpdates,
        installUpdate,
      }}
    >
      {children}
    </UpdaterContext.Provider>
  );
}

export function useUpdater() {
  const ctx = useContext(UpdaterContext);
  if (!ctx) throw new Error("useUpdater must be used within UpdaterProvider");
  return ctx;
}
