import { getCurrentWindow, type TitleBarStyle } from "@tauri-apps/api/window";
import styles from "./TitleBar.module.css";
import { useEffect } from "react";

export function TitleBar() {
  return (
    <div data-tauri-drag-region className={styles.TitleBar}>
      {/* <div className={styles.Buttons}>
        <button onClick={() => appWindow.close()}>Close</button>
        <button onClick={() => appWindow.minimize()}>Minimize</button>
      </div> */}
    </div>
  );
}
