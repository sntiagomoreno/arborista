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
  storedProjectIds: string[];
  saveAccessToken: (token: string) => Promise<void>;
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
  const [storedProjectIds, setStoredProjectIds] = useState<string[]>([]);

  const saveAccessToken = useCallback(async (token: string) => {
    await store.set("figma-access-token", token);
    await store.save();
    setStoredAccessToken(token);
  }, []);

  useEffect(() => {
    (async () => {
      const accessToken = (await store.get("figma-access-token")) as string;
      const projectIds = (await store.get<string[]>("project-ids")) ?? [];
      console.log("Loaded from store:", { accessToken, projectIds });
      setStoredAccessToken(accessToken);
      setStoredProjectIds(projectIds);
    })();
  }, [store]);

  return (
    <StoredDataContext.Provider
      value={{ storedAccessToken, storedProjectIds, saveAccessToken }}
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
