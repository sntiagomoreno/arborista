import StoredDataContext from "@/context/StoredDataContext";
import { DEMO_TOKEN, DEMO_PROJECTS } from "./seedQueryClient";

export function MockStoredDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoredDataContext.Provider
      value={{
        storedAccessToken: DEMO_TOKEN,
        storedProjects: DEMO_PROJECTS,
        saveAccessToken: async () => {},
        saveProject: async () => {},
        removeProject: async () => {},
        clearData: async () => {},
      }}
    >
      {children}
    </StoredDataContext.Provider>
  );
}
