import { useEffect, useState } from "react";
import "./App.css";
import { Field } from "./components/Field/Field";
import { store } from "./store";
import DashboardView from "./views/DashboardView";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useView } from "./context/ViewContext";
import SettingsView from "./views/SettingsView";
import { useStoredData } from "./context/StoredDataContext";
import LoginView from "./views/LoginView";

interface ProjectFile {
  key: string;
  name: string;
}

const FIGMA_API_URL = "https://api.figma.com/v1";

function App() {
  const { currentView } = useView();

  const [accessToken, setAccessToken] = useState("");
  const [projectId, setProjectId] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);

  // Return project files
  const [projectName, setProjectName] = useState("");
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [fileDetails, setFileDetails] = useState<Record<string, any>>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await store.set("figma-access-token", accessToken);
      const stored_projects = await getProjects();
      if (!stored_projects.includes(projectId)) {
        stored_projects.push(projectId);
        await store.set("project-ids", stored_projects);
        await store.save();
        console.log(`Project ID ${projectId} saved to store`);
      }
      await store.save();
      console.log(`Token ${accessToken} saved to store`);
      setTokenSaved(true);
      fetchProject();
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  }

  async function handleClearToken() {
    try {
      await store.delete("figma-access-token");
      await store.delete("project-ids");
      await store.save();
      setAccessToken("");
      setProjectId("");
      setTokenSaved(false);
      console.log("Token cleared from store");
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  }

  async function getProjects(): Promise<string[]> {
    return (await store.get<string[]>("project-ids")) ?? [];
  }

  useEffect(() => {
    (async () => {
      try {
        const stored_token = await store.get("figma-access-token");
        const stored_projects = await getProjects();
        console.log("Stored projects:", stored_projects);
        console.log("Stored token:", stored_token);
        if (stored_token) {
          setAccessToken(stored_token as string);
          setTokenSaved(true);
        }
        if (stored_projects.length) {
          setProjectId(stored_projects[0]);
        }
      } catch (error) {
        console.error("Failed to load token:", error);
      }
    })();
  }, [tokenSaved]);

  // FIGMA API
  async function fetchProject() {
    try {
      const response = await fetch(
        `${FIGMA_API_URL}/projects/${projectId}/files`,
        {
          headers: {
            "X-Figma-Token": `${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.err) {
        throw new Error(data.err);
      }
      console.log("Project data:", data);
      setProjectName(data.name);
      setProjectFiles(data.files);
      if (data.files.length) {
        // Fetch file details for each file
        const entries = await Promise.all(
          data.files.map(async (file: ProjectFile) => {
            const detailData = await fetchFile(file.key);
            return [file.key, detailData] as const;
          })
        );

        const mappedDetails = Object.fromEntries(entries);

        console.log("File details promises:", entries);

        console.log("Reduced file details:", mappedDetails);
        setFileDetails(mappedDetails);
      }
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    }
  }

  async function fetchFile(fileKey: string) {
    try {
      const response = await fetch(
        `${FIGMA_API_URL}/files/${fileKey}?depth=1&branch_data=true`,
        {
          headers: {
            "X-Figma-Token": `${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.err) {
        throw new Error(data.err);
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch file data:", error);
    }
  }

  const { storedAccessToken, storedProjectIds } = useStoredData();

  return (
    <main className="root">
      {storedAccessToken && storedProjectIds.length > 0 ? (
        <DashboardView />
      ) : (
        <LoginView />
      )}
      {currentView === "settings" && <SettingsView />}
      {/* Token Form */}
      {/* <div>
        <button onClick={handleClearToken}>Clear token</button>
        {tokenSaved ? <p>Token: {accessToken}</p> : <p>No token saved</p>}
        <div>
          <Field
            label="Figma Access Token"
            placeholder="Required"
            description="Token is only visible to you and stored locally"
            errorMessage="Please enter a valid token"
            required
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <Field
            label="Project ID"
            placeholder="Required"
            description="Paste the project ID or project URL from Figma"
            errorMessage="Please enter a valid token"
            required
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={!accessToken.length && !projectId.length}
          >
            Save
          </button>
        </div> */}
      {/* Project */}
      {/* <div>
          <h2>{projectName}</h2>
          <ul>
            {projectFiles.map((file) => (
              <li key={file.key}>
                <div>{file.name}</div>
                <div>
                  {(fileDetails[file.key].branches &&
                    `${fileDetails[file.key].branches.length} ${
                      fileDetails[file.key].branches.length > 1
                        ? "branches"
                        : "branch"
                    }`) ||
                    `No branches`}
                  <ul>
                    {fileDetails[file.key].branches &&
                      fileDetails[file.key].branches.map((branch: any) => (
                        <li key={branch.id}>
                          {branch.name} -{" "}
                          {new Date(branch.last_modified).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div> */}
      {/* </div> */}
    </main>
  );
}

export default App;
