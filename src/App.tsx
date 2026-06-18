import HelpPanel from "./components/HelpPanel";
import SearchContainer from "./components/SearchContainer";
import Titlebar from "./components/Titlebar";
import "./css/app.css";

function App() {
  return (
    <div class="syn-app">
      <Titlebar />
      <main class="syn-main">
        <p class="syn-main__description">
          Znajdź synonimy dla dowolnego polskiego słowa.
        </p>
        <HelpPanel />
        <SearchContainer />
      </main>
    </div>
  );
}

export default App;
