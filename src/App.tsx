import Database from '@tauri-apps/plugin-sql';
import { useEffect, useRef, useState } from "preact/hooks";
import SynonymsContainer from './components/SynonymsContainer';
import "./css/pico.violet.css";
import { Synonym, SynonymGroup } from "./types/types";
import { SetupTray } from './backend/TrayIcon';

type Db = Awaited<ReturnType<typeof Database.load>>

function App() {
  const dbRef = useRef<Db | null>(null);

  const [wordInput, setWordInput] = useState("");
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [success, setSuccess] = useState(false);
  const [showSynonyms, setShowSynonyms] = useState(false);

  useEffect(() => {
    async function initDb() {
      dbRef.current = await Database.load("sqlite:synonik.db");
    }
    initDb();
  }, []);

  useEffect(() => {
    SetupTray();
  }, []);

  function get_db() {
    const db = dbRef.current;
    if (!db) {
      throw new Error("Database not initialized");
    }
    return db;
  }

  async function get_synonyms(word: string) {
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
    if (result.length > 0) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setShowSynonyms(true);
    setSynonymGroups(result);
  }

  async function onInputChange(e: any) {
    setWordInput(e.currentTarget.value);
    setSynonymGroups([]);
    setShowSynonyms(false);
  }

  return (
    <main className="container" style={{ marginTop: "2rem" }}>
      <h1>Synonik</h1>
      <input type="text" id="word-input" placeholder="Wpisz słowo..." onInput={onInputChange} />
      <button onClick={() => get_synonyms(wordInput)}>Pobierz synonimy</button>
      {showSynonyms && <SynonymsContainer success={success} word={wordInput} synonymGroups={synonymGroups} />}
    </main>
  );
}

export default App;
