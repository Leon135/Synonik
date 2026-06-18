import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "preact/hooks";
import HelpPanel from "./components/HelpPanel";
import SearchContainer from "./components/SearchContainer";
import ShortcutConfig from "./components/ShortcutConfig";
import Titlebar from "./components/Titlebar";
import useTheme from "./hooks/useTheme";
import "./css/app.css";

function App() {
  const { theme, toggle } = useTheme();
  const [shortcut, setShortcut] = useState("Ctrl+F2");

  useEffect(() => {
    invoke<string>("get_shortcut")
      .then(setShortcut)
      .catch(() => {});
  }, []);

  return (
    <div class="syn-app">
      <Titlebar theme={theme} onToggleTheme={toggle} />
      <main class="syn-main">
        <p class="syn-main__description">
          Znajdź synonimy dla dowolnego polskiego słowa.
        </p>
        <ShortcutConfig initialShortcut={shortcut} />
        <HelpPanel shortcut={shortcut} />
        <SearchContainer />
      </main>
    </div>
  );
}

export default App;
