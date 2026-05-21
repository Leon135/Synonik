import { SynonymGroup } from "../types/types";

export default function SynonymsContainer({ success, word, synonymGroups }: { success: boolean; word: string; synonymGroups: SynonymGroup[] }) {
  if (!success && synonymGroups.length === 0) {
    return (
      <div style={{ marginTop: 24, textAlign: "start", maxwidth: 600 }}>
        <p style={{ fontSize: ".6rem", color: "var(--text-secondary)" }}>
          Nie znaleziono synonimów dla <strong>"{word}"</strong>.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: ".8rem", color: "var(--text-secondary)", marginBottom: 12 }}>
        Synonimy dla <strong>{word}</strong>:
      </p>
      {synonymGroups.map((group) => (
        <div key={group.group_meaning} style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          padding: "10px 16px",
          marginBottom: 8,
        }}>
          <div style={{
            fontSize: ".8rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-secondary)",
            marginBottom: 6,
          }}>
            {group.group_meaning}
          </div>
          <div style={{
            fontSize: ".7rem",
            lineHeight: 1.5,
            color: "var(--color-accent)",
          }}>
            {(group.synonyms as string[]).join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
