import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "preact/hooks";
import "../css/btn.css";
import "../css/shortcut-config.css";

export default function ShortcutConfig({
  initialShortcut,
}: {
  initialShortcut: string;
}) {
  const [keys, setKeys] = useState<string[]>(() => initialShortcut.split("+"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys(initialShortcut.split("+"));
  }, [initialShortcut]);

  function handleKeyDown(event: KeyboardEvent) {
    setSaved(false);
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
    invoke("register_shortcut", { shortcut: keys.join("+") })
      .then(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      })
      .catch((_err) => {
        setSaving(false);
      });
  }

  return (
    <div class="syn-shortcut">
      <div class="syn-shortcut__header">Skrót klawiszowy</div>
      <div class="syn-shortcut__body">
        <div class="syn-shortcut__field">
          <input
            class="syn-input"
            type="text"
            onKeyDown={handleKeyDown}
            readOnly={true}
            value={keys.join("+")}
          />
          {keys.length > 0 && (
            <button
              type="button"
              class="syn-input-clear"
              onClick={handleClear}
              aria-label="Wyczyść"
            >
              <svg
                aria-hidden={true}
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
        <form
          class="syn-shortcut__action"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <button
            type="submit"
            disabled={keys.length === 0 || saving}
            class="syn-btn"
            aria-label="Zapisz skrót"
          >
            {saved ? "Zapisano" : "Zapisz"}
          </button>
        </form>
      </div>
    </div>
  );
}
