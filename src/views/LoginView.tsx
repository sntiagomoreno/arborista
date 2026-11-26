import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { useStoredData } from "@/context/StoredDataContext";
import { useState } from "react";
import styles from "./LoginView.module.css";
import { fetchProfile } from "@/utils/fetchProfile";
import { fetchProject } from "@/utils/fetchProject";
import { parseFolderId } from "@/utils/parseFolderId";
import { cancelSignIn, signInWithFigma } from "@/utils/figmaAuth";
import { Callout } from "@/components/Callout";

type Mode = "oauth" | "token";

export default function LoginView() {
  const { storedAccessToken, saveAccessToken, saveOAuthTokens, saveProject } =
    useStoredData();
  const [mode, setMode] = useState<Mode>("oauth");
  const [token, setToken] = useState("");
  const [folder, setFolder] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setIsWaiting(true);
    try {
      await saveOAuthTokens(await signInWithFigma());
    } catch (err) {
      console.log(err);
      if (!(err instanceof Error && err.message === "Sign-in cancelled")) {
        setError("Sign-in didn't complete. Try again.");
      }
    } finally {
      setIsWaiting(false);
    }
  }

  async function handleSaveToken() {
    setError(null);
    setIsWaiting(true);
    try {
      await fetchProfile(token);
      await saveAccessToken(token);
    } catch (err) {
      console.log(err);
      setError("That token didn't work. Check it hasn't expired.");
    } finally {
      setIsWaiting(false);
    }
  }

  async function handleAddFolder() {
    setError(null);
    setIsWaiting(true);
    try {
      const folderId = parseFolderId(folder);
      const project = await fetchProject(storedAccessToken, folderId);
      await saveProject(folderId, project.name);
    } catch (err) {
      console.log(err);
      setError(
        "Folder doesn't exist with that ID or you don't have permission to view.",
      );
    } finally {
      setIsWaiting(false);
    }
  }

  function switchMode(next: Mode) {
    setError(null);
    setMode(next);
  }

  const header = (title: string, description: React.ReactNode) => (
    <header className={styles.Header}>
      <img
        src="/icon.png"
        className={styles.Logo}
        width={36}
        height="auto"
        alt="Arborista"
      />
      <h1 className={styles.Title}>{title}</h1>
      <p className={styles.Description}>{description}</p>
    </header>
  );

  return (
    <div className={styles.View}>
      <div className={styles.TitleBar} data-tauri-drag-region></div>

      {storedAccessToken ? (
        <>
          {header("Add your first folder", "Paste a Figma folder link or ID.")}
          <main className={styles.Main}>
            {error && <Callout type="error" content={error} />}
            <Field
              label="Folder link or ID"
              value={folder}
              onChange={setFolder}
            />
            <Button
              fat
              fullWidth
              disabled={!folder.length || isWaiting}
              onClick={handleAddFolder}
            >
              {isWaiting ? "Adding folder…" : "Add folder"}
            </Button>
          </main>
        </>
      ) : mode === "oauth" ? (
        <>
          {header(
            "Connect your Figma account",
            "Arborista only reads your files and folders. Your sign-in stays on this Mac.",
          )}
          <main className={styles.Main}>
            {error && <Callout type="error" content={error} />}
            <div className={styles.Actions}>
              <Button fat fullWidth disabled={isWaiting} onClick={handleSignIn}>
                {isWaiting ? "Waiting for Figma…" : "Sign in with Figma"}
              </Button>
              {isWaiting ? (
                <Button fat fullWidth type="secondary" onClick={cancelSignIn}>
                  Cancel
                </Button>
              ) : (
                <Button
                  fat
                  fullWidth
                  type="secondary"
                  onClick={() => switchMode("token")}
                >
                  Use an access token instead
                </Button>
              )}
            </div>
          </main>
        </>
      ) : (
        <>
          {header(
            "Connect with an access token",
            <>
              Your token needs <strong>read access</strong> to Current user,
              File content, File metadata, File versions and Folders.
            </>,
          )}
          <main className={styles.Main}>
            {error && <Callout type="error" content={error} />}
            <Field
              label="Figma access token"
              value={token}
              onChange={setToken}
              description="Only visible to you and stored locally"
            />
            <div className={styles.Actions}>
              <Button
                fat
                fullWidth
                disabled={!token.length || isWaiting}
                onClick={handleSaveToken}
              >
                {isWaiting ? "Checking token…" : "Continue"}
              </Button>
              <Button
                fat
                fullWidth
                type="secondary"
                onClick={() => switchMode("oauth")}
              >
                Sign in with Figma instead
              </Button>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
