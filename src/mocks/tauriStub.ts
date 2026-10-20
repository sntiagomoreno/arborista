// Demo mode in a plain browser has no Tauri runtime; stub just enough IPC for
// the store plugin's top-level `load()` so the mock providers can render.
if (
  import.meta.env.VITE_DEMO_MODE === "true" &&
  !("__TAURI_INTERNALS__" in window)
) {
  (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {
    invoke: async (cmd: string) => {
      if (cmd === "plugin:store|load" || cmd === "plugin:store|get_store") return 1;
      if (cmd === "plugin:store|get") return [null, false];
      return null;
    },
    transformCallback: () => 0,
    metadata: { currentWindow: { label: "main" }, currentWebview: { label: "main", windowLabel: "main" } },
  };
}
