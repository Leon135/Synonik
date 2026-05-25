import { useEffect, useRef, useState } from "preact/hooks";
import SynonymsContainer from "./components/SynonymsContainer";
import Titlebar from "./components/Titlebar";
import { type SynonymGroup } from "./types/ResponseTypes";

import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useHotkeys } from "react-hotkeys-hook";
import ErrorContainer from "./components/ErrorContainer";
import "./css/app.css";

function App() {
  const [wordInput, setWordInput] = useState("");
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [success, setSuccess] = useState(false);
  const [showSynonyms, setShowSynonyms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys(["ctrl+l", "/"], () => {
    inputRef.current?.focus();
  }, { preventDefault: true, useKey: true });

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {
      unlisten = await listen("shortcut-pressed-input", (event) => {
        setWordInput(event.payload as string);
        get_synonyms(event.payload as string);
      });
    }

    init();
    return () => { unlisten?.(); };
  }, []);



  async function get_synonyms(word: string) {
    if (!word.trim()) return;
    setIsLoading(true);

    invoke<[string, string][]>("search_synonyms", { word: word.trim().toLowerCase() }).then((response) => {
      const groups = new Map<string, SynonymGroup>();

      for (let [word, group_meaning] of response) {
        if (!groups.has(group_meaning)) {
          groups.set(group_meaning, {
            group_meaning: group_meaning,
            synonyms: []
          });
        }
        groups.get(group_meaning)?.synonyms.push(word);
      }

      const result = Array.from(groups.values());
      return result;

    }).then((result) => {
      setError("");
      setSuccess(result.length > 0);
      setShowSynonyms(true);
      setSynonymGroups(result);
    }).catch((error) => {
      setError(error);
      setSuccess(false);
    }).finally(() => {
      setIsLoading(false);
    });
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
    if (e.key === "ArrowRight") (document.querySelector(".card") as HTMLElement)?.focus();
  }

  function onClear() {
    setWordInput("");
    setSynonymGroups([]);
    setShowSynonyms(false);
  }

  return (
    <div class="app">
      <Titlebar />
      <main class="main">
        <p class="main__description">
          Znajdź synonimy dla dowolnego polskiego słowa.
        </p>
        <div class="help-panel">
          <div class="help-panel-header" onClick={() => setHelpOpen(p => !p)}>
            <span>O programie</span>
            <span>{helpOpen ? '▴' : '▾'}</span>
          </div>
          {helpOpen && (
            <div class="help-panel-body">
              <p><strong>Synonik</strong> to podręczny i lekki słownik synonimów.</p>
              <h4>Jak używać?</h4>
              <ul>
                <li>Naciśnij <kbd>Ctrl+F2</kbd> - program przechwyci zaznaczony tekst i wyszuka synonimy</li>
                <li>Możesz też wpisać słowo ręcznie w pole wyszukiwania</li>
              </ul>
              <p class="help-panel-footer">Wersja beta @Leon135</p>
            </div>
          )}
        </div>
        <form class="search" onSubmit={(e) => { e.preventDefault(); get_synonyms(wordInput); }}>
          <div class="search__input-wrapper">
            <input
              ref={inputRef}
              class="search__input"
              placeholder="Wpisz słowo..."
              value={wordInput}
              onInput={onInputChange}
              onKeyDown={onKeyDown}
            />
            {wordInput && (
              <button type="button" class="search__clear" onClick={onClear} aria-label="Wyczyść">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            class="button"
            disabled={!wordInput.trim() || isLoading}
          >
            {isLoading ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 button__icon button__icon--spin">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search button__icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
            )}
            Szukaj
          </button>
        </form>

        {showSynonyms && !isLoading && (
          <SynonymsContainer success={success} word={wordInput.trim()} synonymGroups={synonymGroups} />
        )}
        {error.length > 0 && (
          <ErrorContainer error={error} />
        )}
      </main>
    </div>
  );
}

export default App;
