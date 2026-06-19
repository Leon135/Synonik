import { useState } from "preact/hooks";
import "../css/about-panel.css";

export default function AboutPanel({ shortcut }: { shortcut: string }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div class="syn-about">
      {/* biome-ignore lint/a11y/useSemanticElements: div needed to avoid default button styles */}
      <div
        class="syn-collapse-header"
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
        <span class="syn-collapse-chevron">{aboutOpen ? "▴" : "▾"}</span>
      </div>
      {aboutOpen && (
        <div class="syn-about__body syn-panel">
          <p>
            <strong>Synonik</strong> to podręczny i lekki słownik synonimów.
          </p>
          <h4>Jak używać?</h4>
          <p class="syn-about__usage">
            Wpisz słowo w pole wyszukiwania i kliknij <strong>Szukaj</strong>,
            albo zaznacz tekst w dowolnej aplikacji i naciśnij skrót klawiszowy.
          </p>

          <h4>Skróty klawiszowe</h4>
          <table class="syn-about__shortcuts">
            <thead>
              <tr>
                <th>Skrót</th>
                <th>Działanie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <kbd>{shortcut}</kbd>
                </td>
                <td>Przechwyć zaznaczony tekst i wyszukaj synonimy</td>
              </tr>
              <tr>
                <td>
                  <kbd>Ctrl+L</kbd> lub <kbd>/</kbd>
                </td>
                <td>Zaznacz pole wyszukiwania</td>
              </tr>
              <tr>
                <td>
                  <kbd>→</kbd> <kbd>←</kbd>
                </td>
                <td>Nawigacja między grupami synonimów</td>
              </tr>
              <tr>
                <td>
                  <kbd>Enter</kbd>
                </td>
                <td>Wyszukaj synonimy dla wpisanego słowa</td>
              </tr>
            </tbody>
          </table>
          <p class="syn-about__footer">
            Wersja beta <a href={"https://leon135.xyz"}>@Leon135</a>
          </p>
        </div>
      )}
    </div>
  );
}
