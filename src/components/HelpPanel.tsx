import { useState } from "preact/hooks";
import "../css/help-panel.css";

export default function HelpPanel({ shortcut }: { shortcut: string }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div class="syn-about">
      {/* biome-ignore lint/a11y/useSemanticElements: div needed to avoid default button styles */}
      <div
        class="syn-about__header"
        role="button"
        tabIndex={0}
        onClick={() => setAboutOpen((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setAboutOpen((p) => !p);
          }
        }}
      >
        <span>O programie</span>
        <span class="syn-about__chevron">{aboutOpen ? "▴" : "▾"}</span>
      </div>
      {aboutOpen && (
        <div class="syn-about__body">
          <p>
            <strong>Synonik</strong> to podręczny i lekki słownik synonimów.
          </p>
          <h4>Jak używać?</h4>
          <ul>
            <li>
              Naciśnij <kbd>{shortcut}</kbd> — program przechwyci zaznaczony
              tekst i wyszuka synonimy
            </li>
            <li>Możesz też wpisać słowo ręcznie w pole wyszukiwania</li>
          </ul>
          <p class="syn-about__footer">
            Wersja beta <a href={"https://leon135.xyz"}>@Leon135</a>
          </p>
        </div>
      )}
    </div>
  );
}
