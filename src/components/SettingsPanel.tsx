import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "preact/hooks";
import "../css/btn.css";
import "../css/settings-panel.css";

export default function SettingsPanel({
  initialShortcut,
}: {
  initialShortcut: string;
}) {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<string[]>(() => initialShortcut.split("+"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scale, setScale] = useState(document.body.style.zoom || "1");

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
    <div class="syn-settings">
      <div
        class="syn-settings__header"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((p) => !p);
          }
        }}
      >
        <span>Ustawienia</span>
        <span class="syn-settings__chevron">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div class="syn-settings__body">
          <p class="syn-settings__title">Skrót klawiszowy</p>
          <div class="syn-settings__row">
            <div class="syn-settings__field">
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
              class="syn-settings__action"
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

          <p class="syn-settings__title">Skala interfejsu</p>
          <div class="syn-settings__row">
            <input
              class="syn-settings__slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onInput={(e) => {
                const newScale = (e.target as HTMLInputElement).value;
                setScale(newScale);
                document.body.style.zoom = newScale;
              }}
            />
            <p>{parseFloat(scale) * 100}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
