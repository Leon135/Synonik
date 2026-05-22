import Database from '@tauri-apps/plugin-sql';
import { useEffect, useRef, useState } from "preact/hooks";
import SynonymsContainer from './components/SynonymsContainer';
import { Synonym, SynonymGroup } from "./types/types";

import "react-windows-ui/config/app-config.css";
import "react-windows-ui/dist/react-windows-ui.min.css";
import "react-windows-ui/icons/winui-icons.min.css";
import "./css/theme.css";

import { listen, type Event } from '@tauri-apps/api/event';
import { AppContainer, AppTheme, Button, InputText } from "react-windows-ui";

type Db = Awaited<ReturnType<typeof Database.load>>

function App() {
  const dbRef = useRef<Db | null>(null);
  const [wordInput, setWordInput] = useState("");
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [success, setSuccess] = useState(false);
  const [showSynonyms, setShowSynonyms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {
      dbRef.current = await Database.load("sqlite:synonik.db");

      unlisten = await listen("shortcut-pressed-input", (event: Event<string>) => {
        setWordInput(event.payload);
        get_synonyms(event.payload);
      });
    }

    init();

    return () => { unlisten?.(); };
  }, []);


  function get_db() {
    const db = dbRef.current;
    if (!db) throw new Error("Database not initialized");
    return db;
  }

  async function get_synonyms(word: string) {
    if (!word.trim()) return;
    setIsLoading(true);

    const db = get_db();

    const query = `
    WITH base_form_id AS(
      SELECT bf.base_form_id
        FROM Words w
        JOIN BaseForms bf ON w.id = bf.word_id
        WHERE w.word = ?
    ),
      group_ids AS(
        SELECT DISTINCT group_id
        FROM WordInGroup
        WHERE word_id IN(SELECT base_form_id FROM base_form_id)
      )
    SELECT DISTINCT w.word, sg.group_meaning
    FROM WordInGroup wig
    JOIN Words w ON wig.word_id = w.id
    JOIN SynonymGroups sg ON wig.group_id = sg.id
    WHERE wig.group_id IN(SELECT group_id FROM group_ids)
      AND wig.word_id NOT IN(SELECT base_form_id FROM base_form_id)
    `

    const rows = await db.select<Synonym[]>(query, [word])

    const groups = new Map<string, SynonymGroup>()

    for (const row of rows) {
      if (!groups.has(row.group_meaning)) {
        groups.set(row.group_meaning, {
          group_meaning: row.group_meaning,
          synonyms: []
        })
      }
      groups.get(row.group_meaning)!.synonyms.push(row.word)
    }

    const result: SynonymGroup[] = Array.from(groups.values())
    setSuccess(result.length > 0);
    setShowSynonyms(true);
    setSynonymGroups(result);
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
