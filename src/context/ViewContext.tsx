import { createContext, useContext, useState, ReactNode } from "react";

export type ViewType = "login" | "dashboard" | "detail" | "settings";

interface ViewContextType {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  viewData?: any;
  setViewData: (data: any) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
  initialView?: ViewType;
}

export function ViewProvider({ children, initialView = "login" }: ViewProviderProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [viewData, setViewData] = useState<any>();

  const setView = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <ViewContext.Provider value={{ currentView, setView, viewData, setViewData }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}