import { Button } from "@/components/Button";
import { useUpdater } from "@/context/UpdaterContext";
import styles from "@/views/SettingsView.module.css";

export function UpdateSection() {
  const {
    status,
    currentVersion,
    newVersion,
    notes,
    progress,
    error,
    checkForUpdates,
    installUpdate,
  } = useUpdater();

  const hasUpdate = status === "available" || status === "downloading";

  return (
    <div className={styles.Section}>
      <h2 className={styles.SectionHeading}>App updates</h2>
      <ul className={styles.SectionList}>
        <li className={styles.SectionListItem}>
          <div>
            <h3 className={styles.ItemLabel}>
              {hasUpdate ? `Version ${newVersion} available` : "Arborista"}
            </h3>
            <p className={styles.ItemDescription}>
              {hasUpdate
                ? (notes?.split("\n").find((l) => l.trim()) ??
                  `You're on version ${currentVersion}.`)
                : `Version ${currentVersion} · ${status === "checking" ? "Checking for updates…" : "Up to date"}`}
            </p>
            {error && <p className={styles.ItemError}>{error}</p>}
          </div>
          {hasUpdate ? (
            <Button
              fullWidth
              size="small"
              disabled={status === "downloading"}
              onClick={installUpdate}
            >
              {status === "downloading"
                ? `Downloading… ${progress ?? 0}%`
                : "Install and restart"}
            </Button>
          ) : (
            <Button
              fullWidth
              type="secondary"
              size="small"
              disabled={status === "checking"}
              onClick={() => checkForUpdates()}
            >
              {status === "checking" ? "Checking…" : "Check for updates"}
            </Button>
          )}
        </li>
      </ul>
    </div>
  );
}
