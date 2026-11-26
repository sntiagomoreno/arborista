import { useState } from "react";
import StoredDataContext from "@/context/StoredDataContext";
import { DEMO_TOKEN, DEMO_PROJECTS } from "./seedQueryClient";

export function MockStoredDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // `?login` starts signed out so the login flow can be walked through.
  const startSignedOut = new URLSearchParams(location.search).has("login");
  const [token, setToken] = useState(startSignedOut ? "" : DEMO_TOKEN);
  const [projects, setProjects] = useState(startSignedOut ? [] : DEMO_PROJECTS);

  return (
    <StoredDataContext.Provider
      value={{
        storedAccessToken: token,
        authType: "oauth",
        storedProjects: projects,
        saveAccessToken: async () => setToken(DEMO_TOKEN),
        saveOAuthTokens: async () => setToken(DEMO_TOKEN),
        saveProject: async () => setProjects(DEMO_PROJECTS),
        removeProject: async () => {},
        clearData: async () => {},
      }}
    >
      {children}
    </StoredDataContext.Provider>
  );
}
