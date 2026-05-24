import { type SynonymGroup } from "../types/ResponseTypes";
import "../css/synonyms-container.css";

export default function SynonymsContainer({ success, word, synonymGroups }: { success: boolean; word: string; synonymGroups: SynonymGroup[] }) {
  if (!success && synonymGroups.length === 0) {
    return (
      <section class="results">
        <p class="results__not-found">
          Nie znaleziono synonimów dla słowa <strong>"{word}"</strong>.
        </p>
      </section>
    );
  }

  return (
    <section class="results">
      <h2 class="results__heading">
        Synonimy dla słowa <strong>{word}</strong>:
      </h2>

      {synonymGroups.map((group) => (
        <article class="card" key={group.group_meaning}>
          <h3 class="card__title">{group.group_meaning}</h3>
          <p class="card__synonyms">{(group.synonyms as string[]).join(", ")}</p>
        </article>
      ))}
    </section>
  );
}
