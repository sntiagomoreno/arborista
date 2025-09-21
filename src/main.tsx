import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { TitleBar } from "./components/TitleBar";
import { ViewProvider } from "./context/ViewContext";
import { FigmaDataProvider } from "./context/FigmaDataContext";
import { StoredDataProvider } from "./context/StoredDataContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <StoredDataProvider>
      <QueryClientProvider client={queryClient}>
        <FigmaDataProvider>
          <ViewProvider initialView="dashboard">
            <App />
          </ViewProvider>
        </FigmaDataProvider>
      </QueryClientProvider>
    </StoredDataProvider>
  </React.StrictMode>
);
