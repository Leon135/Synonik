import { useRef } from "preact/hooks";
import "../css/synonyms-list.css";
import { type SynonymGroup } from "../types/ResponseTypes";

export default function SynonymsList({
  success,
  word,
  synonymGroups,
}: {
  success: boolean;
  word: string;
  synonymGroups: SynonymGroup[];
}) {
  const containerRef = useRef<HTMLElement>(null);

  if (!success && synonymGroups.length === 0) {
    return (
      <section class="synonyms-list">
        <p class="synonyms-list__not-found">
          Nie znaleziono synonimów dla słowa <strong>"{word}"</strong>.
        </p>
      </section>
    );
  }

  function handleKeyDown(event: KeyboardEvent) {
    const cards = containerRef.current?.querySelectorAll<HTMLElement>(".card");
    if (!cards?.length) return;

    const current = Array.from(cards).indexOf(
      document.activeElement as HTMLElement,
    );

    if (event.key === "ArrowRight") {
      event.preventDefault();
      cards[(current + 1) % cards.length].focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      cards[(current - 1 + cards.length) % cards.length].focus();
    }
  }

  return (
    <section ref={containerRef} class="synonyms-list" onKeyDown={handleKeyDown}>
      <h2 class="synonyms-list__heading">
        Synonimy dla słowa <strong>{word}</strong>:
      </h2>
      {synonymGroups.map((group) => (
        <article tabIndex={0} class="card" key={group.group_meaning}>
          <h3 class="card__title">{group.group_meaning}</h3>
          <p class="card__synonyms">
            {(group.synonyms as string[]).join(", ")}
          </p>
        </article>
      ))}
    </section>
  );
}
