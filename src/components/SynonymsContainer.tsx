import { SynonymGroup } from "../types/types";

export default function SynonymsContainer({ success: success, word, synonymGroups }: { success: boolean, word: string, synonymGroups: SynonymGroup[] }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Synonimy dla słowa - {word}</h3>
      {(!success && synonymGroups.length == 0) ? <p>Nie znaleziono synonimów dla tego słowa.</p> : null}
      <ul>
        {synonymGroups.map(group => (
          <li>
            <strong>{group.group_meaning}:</strong>
            <p>{group.synonyms.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}