import "./App.css";
import DashboardView from "./views/DashboardView";
import { useView } from "./context/ViewContext";
import SettingsView from "./views/SettingsView";
import { useStoredData } from "./context/StoredDataContext";
import LoginView from "./views/LoginView";

function App() {
  const { currentView } = useView();
  const { storedAccessToken, storedProjects } = useStoredData();

  return (
    <main className="root">
      {storedAccessToken && storedProjects.length > 0 ? (
        <DashboardView />
      ) : (
        // <LoginView />
        <LoginView />
      )}
      {currentView === "settings" && <SettingsView />}
    </main>
  );
}

export default App;
