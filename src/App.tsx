import Titlebar from "./components/Titlebar";

import HelpContainer from "./components/HelpContainer";
import SearchContainer from "./components/SearchContainer";
import "./css/app.css";

function App() {
  return (
    <div class="app">
      <Titlebar />
      <main class="main">
        <p class="main__description">
          Znajdź synonimy dla dowolnego polskiego słowa.
        </p>
        <HelpContainer />
        <SearchContainer />
      </main>
    </div>
  );
}

export default App;
