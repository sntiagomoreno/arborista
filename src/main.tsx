import "./mocks/tauriStub";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { TitleBar } from "./components/TitleBar";
import { ViewProvider } from "./context/ViewContext";
import { FigmaDataProvider } from "./context/FigmaDataContext";
import { StoredDataProvider } from "./context/StoredDataContext";
import { MockStoredDataProvider } from "./mocks/MockStoredDataProvider";
import { UpdaterProvider } from "./context/UpdaterContext";
import { seedQueryClient } from "./mocks/seedQueryClient";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

if (DEMO_MODE) {
  seedQueryClient(queryClient);
}

const DataProvider = DEMO_MODE ? MockStoredDataProvider : StoredDataProvider;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <DataProvider>
      <QueryClientProvider client={queryClient}>
        <FigmaDataProvider>
          <ViewProvider initialView="dashboard">
            <UpdaterProvider>
              <App />
            </UpdaterProvider>
          </ViewProvider>
        </FigmaDataProvider>
      </QueryClientProvider>
    </DataProvider>
  </React.StrictMode>
);
