import { useEffect, useState } from "preact/hooks";
import SynonymsContainer from './components/SynonymsContainer';
import { Synonym, SynonymGroup } from "./types/ResponseTypes";

import "react-windows-ui/config/app-config.css";
import "react-windows-ui/dist/react-windows-ui.min.css";
import "react-windows-ui/icons/winui-icons.min.css";
import "./css/theme.css";

import { invoke } from '@tauri-apps/api/core';
import { listen, type Event } from '@tauri-apps/api/event';
import { AppContainer, AppTheme, Button, InputText } from "react-windows-ui";

function App() {
  const [wordInput, setWordInput] = useState("");
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [success, setSuccess] = useState(false);
  const [showSynonyms, setShowSynonyms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {

      unlisten = await listen("shortcut-pressed-input", (event: Event<string>) => {
        setWordInput(event.payload);
        get_synonyms(event.payload);
      });
    }

    init();

    return () => { unlisten?.(); };
  }, []);

  async function get_synonyms(word: string) {
    if (!word.trim()) return;
    setIsLoading(true);

    invoke<[string, string]>("search_synonyms", { word: word.trim() }).then((response: [string, string]) => {
      console.log(typeof response);

      const groups = new Map<string, SynonymGroup>();

      for (let [word, group_meaning] of response) {
        console.log(group_meaning);
        if (!groups.has(group_meaning)) {
          groups.set(group_meaning, {
            group_meaning: group_meaning,
            synonyms: []
          });
        }

        groups.get(group_meaning)?.synonyms.push(word);
      }

      const result = Array.from(groups.values());
      console.log(groups);
      setSuccess(result.length > 0);
      setShowSynonyms(true);
      setSynonymGroups(result);
    });


    setIsLoading(false);
  }

  function onInputChange(e: any) {
    setWordInput(e.currentTarget.value);
    if (showSynonyms) {
      setSynonymGroups([]);
      setShowSynonyms(false);
    }
  }

  function onKeyDown(e: any) {
    if (e.key === "Enter") get_synonyms(wordInput);
  }

  function onClear() {
    setWordInput("");
    setSynonymGroups([]);
    setShowSynonyms(false);
  }

  return (
    <AppContainer>
      <AppTheme scheme={"dark"} />
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 20px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          userSelect: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <i className="icons10-collection" style={{ fontSize: "1rem", color: "var(--color-accent)" }} />
          <span style={{ fontSize: "0.722rem", fontWeight: 600 }}>Synonik</span>
        </div>

        <div style={{ padding: 24, maxWidth: 680 }}>
          <p style={{ marginTop: 0, marginBottom: 20, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Znajdź synonimy dla dowolnego polskiego słowa.
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <InputText
              placeholder="Wpisz słowo..."
              value={wordInput}
              onInput={onInputChange}
              onKeyDown={onKeyDown}
              onClearButtonClick={onClear}
              clearButton
            // autoFocus
            // setStatus={isLoading ? "loading" : "default"}
            />
            <Button
              type="primary"
              value="Szukaj"
              icon={<i className="icons10-search" />}
              onClick={() => get_synonyms(wordInput)}
              disabled={!wordInput.trim()}
            />
          </div>

          {showSynonyms && !isLoading && (
            <SynonymsContainer success={success} word={wordInput} synonymGroups={synonymGroups} />
          )}
        </div>
      </div>
    </AppContainer>
  );
}

export default App;
