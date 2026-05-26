import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "preact/hooks";
import "../css/btn.css";
import "../css/help-panel.css";

export default function HelpPanel() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    invoke("get_shortcut")
      .then((shortcut: any) => {
        setKeys(shortcut.split("+"));
      })
      .catch(() => {
        setKeys(["Control", "F2"]);
      });
  }, []);

  function handleKeyDown(event: KeyboardEvent) {
    setKeys((p) => {
      const newKeys = [...p];
      if (!newKeys.includes(event.key)) {
        newKeys.push(event.key);
      }
      return newKeys;
    });
  }

  function handleClear() {
    setKeys([]);
  }

  function handleSave() {
    setSaving(true);
    setFeedback(null);
    invoke("register_shortcut", { shortcut: keys.join("+") })
      .then(() => {
        setFeedback("Zapisano");
      })
      .catch((err: string) => {
        setFeedback(`Błąd: ${err}`);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <div class="syn-help">
      <div class="syn-help__header" onClick={() => setHelpOpen((p) => !p)}>
        <span>O programie</span>
        <span>{helpOpen ? "▴" : "▾"}</span>
      </div>
      {helpOpen && (
        <div class="syn-help__body">
          <form
            class="syn-help__shortcut-wrapper"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div class="syn-help__shortcut-field">
              <input
                class="syn-input"
                type="text"
                onKeyDown={handleKeyDown}
                readOnly={true}
                value={keys.join("+")}
              />
              {keys.length > 0 && (
                <button
                  class="syn-input-clear"
                  onClick={handleClear}
                  aria-label="Wyczyść"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-x"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="button"
              disabled={keys.length === 0 || saving}
              onClick={handleSave}
              class="syn-btn"
              aria-label="Zapisz skrót"
            >
              {saving ? "Zapisywanie..." : "Zapisz"}
            </button>
            {feedback && <span class="syn-help__feedback">{feedback}</span>}
          </form>

          <p>
            <strong>Synonik</strong> to podręczny i lekki słownik synonimów.
          </p>
          <h4>Jak używać?</h4>
          <ul>
            <li>
              Naciśnij <kbd>Ctrl+F2</kbd> - program przechwyci zaznaczony tekst
              i wyszuka synonimy
            </li>
            <li>Możesz też wpisać słowo ręcznie w pole wyszukiwania</li>
          </ul>
          <p class="syn-help__footer">Wersja beta @Leon135</p>
        </div>
      )}
    </div>
  );
}
