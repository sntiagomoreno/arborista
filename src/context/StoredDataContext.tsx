import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { store } from "@/store";
import { registerOAuthToken } from "@/utils/apiUrl";
import { type OAuthTokens, refreshFigmaTokens } from "@/utils/figmaAuth";

export type AuthType = "oauth" | "token";

// Refresh OAuth tokens once they're within a week of Figma's 90-day expiry.
const REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type StoredOAuth = Omit<OAuthTokens, "accessToken">;

interface StoredDataContextType {
  storedAccessToken: string;
  authType: AuthType | null;
  storedProjects: string[];
  saveAccessToken: (token: string) => Promise<void>;
  saveOAuthTokens: (tokens: OAuthTokens) => Promise<void>;
  saveProject: (id: string, name: string) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  clearData: () => Promise<void>;
}

const StoredDataContext = createContext<StoredDataContextType | undefined>(
  undefined,
);

export function StoredDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storedAccessToken, setStoredAccessToken] = useState<string>("");
  const [authType, setAuthType] = useState<AuthType | null>(null);
  const [storedProjects, setStoredProjects] = useState<string[]>([]);

  const saveAccessToken = useCallback(async (token: string) => {
    registerOAuthToken(null);
    await store.set("figma-access-token", token);
    await store.delete("figma-oauth");
    await store.save();
    setStoredAccessToken(token);
    setAuthType("token");
  }, []);

  const saveOAuthTokens = useCallback(async (tokens: OAuthTokens) => {
    const { accessToken, ...oauth } = tokens;
    registerOAuthToken(accessToken);
    await store.set("figma-access-token", accessToken);
    await store.set("figma-oauth", oauth satisfies StoredOAuth);
    await store.save();
    setStoredAccessToken(accessToken);
    setAuthType("oauth");
  }, []);

  const refreshIfExpiring = useCallback(async () => {
    const oauth = await store.get<StoredOAuth>("figma-oauth");
    if (!oauth || oauth.expiresAt - Date.now() > REFRESH_WINDOW_MS) return;
    try {
      await saveOAuthTokens(await refreshFigmaTokens(oauth.refreshToken));
    } catch (err) {
      console.log("Failed to refresh Figma token:", err);
      // A token that has already expired is useless; send the user back to
      // sign in instead of failing every request.
      if (oauth.expiresAt <= Date.now()) {
        registerOAuthToken(null);
        await store.delete("figma-access-token");
        await store.delete("figma-oauth");
        await store.save();
        setStoredAccessToken("");
        setAuthType(null);
      }
    }
  }, [saveOAuthTokens]);

  const saveProject = useCallback(
    async (id: string, name: string) => {
      const list = [...storedProjects, JSON.stringify({ id, name })];
      await store.set("projects", list);
      await store.save();
      setStoredProjects(list);
    },
    [storedProjects],
  );

  const removeProject = useCallback(
    async (id: string) => {
      const list = storedProjects.filter((p) => JSON.parse(p).id !== id);
      await store.set("projects", list);
      await store.save();
      setStoredProjects(list);
    },
    [storedProjects],
  );

  const clearData = useCallback(async () => {
    console.log("happening");
    registerOAuthToken(null);
    await store.clear();
    await store.save();
    setStoredAccessToken("");
    setAuthType(null);
    setStoredProjects([]);
  }, []);

  useEffect(() => {
    (async () => {
      const accessToken = (await store.get("figma-access-token")) as string;
      const oauth = await store.get<StoredOAuth>("figma-oauth");
      const projectIds = (await store.get<string[]>("projects")) ?? [];
      if (oauth) registerOAuthToken(accessToken);
      setStoredAccessToken(accessToken);
      setAuthType(accessToken ? (oauth ? "oauth" : "token") : null);
      setStoredProjects(projectIds);
      await refreshIfExpiring();
    })();
    // The window is hidden rather than closed, so also check when it returns.
    window.addEventListener("focus", refreshIfExpiring);
    return () => window.removeEventListener("focus", refreshIfExpiring);
  }, [refreshIfExpiring]);

  return (
    <StoredDataContext.Provider
      value={{
        storedAccessToken,
        authType,
        storedProjects,
        saveAccessToken,
        saveOAuthTokens,
        saveProject,
        removeProject,
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
