import type { SynonymGroup } from "../types/ResponseTypes";

export default function groupSynonyms(
  response: [string, string][],
): SynonymGroup[] {
  const groups = new Map<string, SynonymGroup>();

  for (const [word, group_meaning] of response) {
    if (!groups.has(group_meaning)) {
      groups.set(group_meaning, {
        group_meaning: group_meaning,
        synonyms: [],
      });
    }
    groups.get(group_meaning)?.synonyms.push(word);
  }

  const result = Array.from(groups.values());

  return result;
}
