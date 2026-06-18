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
      <section class="syn-list">
        <p class="syn-list__not-found">
          Nie znaleziono synonimów dla słowa <strong>"{word}"</strong>.
        </p>
      </section>
    );
  }

  function handleKeyDown(event: KeyboardEvent) {
    const cards = containerRef.current?.querySelectorAll<HTMLElement>(".syn-card");
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
    <section ref={containerRef} class="syn-list" onKeyDown={handleKeyDown}>
      <h2 class="syn-list__heading">
        Synonimy dla słowa <strong>{word}</strong>:
      </h2>
      {synonymGroups.map((group, index) => (
        <article tabIndex={0} class="syn-card" key={index}>
          <h3 class="syn-card__title">{group.group_meaning}</h3>
          <p class="syn-card__synonyms">
            {group.synonyms.join(", ")}
          </p>
        </article>
      ))}
    </section>
  );
}
