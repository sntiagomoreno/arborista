import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { store } from "@/store";

interface StoredDataContextType {
  storedAccessToken: string;
  storedProjects: string[];
  saveAccessToken: (token: string) => Promise<void>;
  saveProject: (id: string, name: string) => Promise<void>;
  clearData: () => Promise<void>;
}

const StoredDataContext = createContext<StoredDataContextType | undefined>(
  undefined
);

export function StoredDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storedAccessToken, setStoredAccessToken] = useState<string>("");
  const [storedProjects, setStoredProjects] = useState<string[]>([]);

  const saveAccessToken = useCallback(async (token: string) => {
    await store.set("figma-access-token", token);
    await store.save();
    setStoredAccessToken(token);
  }, []);

  const saveProject = useCallback(async (id: string, name: string) => {
    const list = [...storedProjects, JSON.stringify({ id, name })];
    await store.set("projects", list);
    await store.save();
    setStoredProjects(list);
  }, [storedProjects]);

  const clearData = useCallback(async () => {
    console.log("happening");
    await store.clear();
    await store.save();
    setStoredAccessToken("");
    setStoredProjects([]);
  }, []);

  useEffect(() => {
    (async () => {
      const accessToken = (await store.get("figma-access-token")) as string;
      const projectIds = (await store.get<string[]>("projects")) ?? [];
      console.log("Loaded from store:", { accessToken, projectIds });
      setStoredAccessToken(accessToken);
      setStoredProjects(projectIds);
    })();
  }, [store]);

  return (
    <StoredDataContext.Provider
      value={{
        storedAccessToken,
        storedProjects,
        saveAccessToken,
        saveProject,
        clearData,
      }}
    >
      {children}
    </StoredDataContext.Provider>
  );
}

export function useStoredData() {
  const context = useContext(StoredDataContext);
  if (context === undefined) {
    throw new Error("useStoredData must be used within a StoredDataProvider");
  }
  return context;
}

export default StoredDataContext;
