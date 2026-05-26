import { useState } from "preact/hooks";

export default function HelpContainer() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div class="help-panel">
      <div class="help-panel__header" onClick={() => setHelpOpen((p) => !p)}>
        <span>O programie</span>
        <span>{helpOpen ? "▴" : "▾"}</span>
      </div>
      {helpOpen && (
        <div class="help-panel__body">
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
          <p class="help-panel__footer">Wersja beta @Leon135</p>
        </div>
      )}
    </div>
  );
}
