import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { useStoredData } from "@/context/StoredDataContext";
import { useState } from "react";
import styles from "./LoginView.module.css";
import { useCurrentUserQuery } from "@/hooks/useFigmaQueries";
import { fetchProfile } from "@/utils/fetchProfile";
import { fetchProject } from "@/utils/fetchProject";

export default function LoginView() {
  const { storedAccessToken, storedProjectIds, saveAccessToken } =
    useStoredData();
  const [token, setToken] = useState(storedAccessToken);
  const [projectId, setProjectId] = useState(
    storedProjectIds.length > 0 ? storedProjectIds[0] : ""
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
      } catch (err) {
        if (err) {
          console.log(err);
          setError(
            "Project doesn't exist with that ID or you don't have permission to view."
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
        <h1 className={styles.Title}>Connect your first Figma project</h1>
        <p className={styles.Description}>
          Make sure your Figma access token includes at least{" "}
          <strong>read access</strong> to Current user, File metadata, File
          version and Projects.
        </p>
      </header>

      <main className={styles.Main}>
        {error && <div className={styles.ErrorMessage}>{error}</div>}
        <div className={styles.Form}>
          <Field
            label="Figma access token"
            value={token ? token : ""}
            onChange={(value) => setToken(value)}
            description="Only visible to you and stored locally"
          />
          <Field
            label="Project ID"
            value={projectId ? projectId : ""}
            onChange={(value) => setProjectId(value)}
          />
        </div>
        <Button fullWidth onClick={() => handleSave(token, projectId)}>
          Save
        </Button>
      </main>
    </div>
  );
}
