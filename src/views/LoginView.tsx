import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { useStoredData } from "@/context/StoredDataContext";
import { useState } from "react";
import styles from "./LoginView.module.css";
import { useCurrentUserQuery } from "@/hooks/useFigmaQueries";
import { fetchProfile } from "@/utils/fetchProfile";
import { fetchProject } from "@/utils/fetchProject";
import { Callout } from "@/components/Callout";

export default function LoginView() {
  const { storedAccessToken, storedProjects, saveAccessToken, saveProject } =
    useStoredData();
  const [token, setToken] = useState(storedAccessToken);
  const [projectId, setProjectId] = useState(
    storedProjects.length > 0 ? JSON.parse(storedProjects[0]).id : ""
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSave(accessToken: string, projectId: string) {
    try {
      const data = await fetchProfile(accessToken);
      console.log("User data:", data);
      setError(null);
      try {
        const projectResponse = await fetchProject(accessToken, projectId);
        console.log("Project data:", projectResponse);
        setError(null);

        // Save token and project ID after successful validation
        await saveAccessToken(accessToken);
        await saveProject(projectId, projectResponse.name);
      } catch (err) {
        if (err) {
          console.log(err);
          setError(
            "Folder doesn't exist with that ID or you don't have permission to view."
          );
        }
      }
    } catch (err) {
      if (err) {
        console.log(err);
        setError("Invalid or expired access token.");
      }
    }
  }

  return (
    <div className={styles.View}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>Connect your first Figma folder</h1>
        <p className={styles.Description}>
          Make sure your Figma access token includes at least{" "}
          <strong>read access</strong> to Current user, File metadata, File
          version and Folders.
        </p>
      </header>

      <main className={styles.Main}>
        {error && <Callout type="error" content={error} />}
        <div className={styles.Form}>
          <Field
            label="Figma access token"
            value={token ? token : ""}
            onChange={(value) => setToken(value)}
            description="Only visible to you and stored locally"
          />
          <Field
            label="Folder ID"
            value={projectId ? projectId : ""}
            onChange={(value) => setProjectId(value)}
          />
        </div>
        <Button
          fat
          disabled={!token.length || !projectId.length}
          fullWidth
          onClick={() => handleSave(token, projectId)}
        >
          Save
        </Button>
      </main>
    </div>
  );
}
