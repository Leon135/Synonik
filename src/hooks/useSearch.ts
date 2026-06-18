import { invoke } from "@tauri-apps/api/core";
import { useRef, useState } from "preact/hooks";
import groupSynonyms from "../lib/groupSynonyms";
import { SynonymGroup } from "../types/ResponseTypes";

export default function useSearch() {
  const [wordInput, setWordInput] = useState("");
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [success, setSuccess] = useState(false);
  const [showSynonyms, setShowSynonyms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function get_synonyms(word: string) {
    if (!word.trim()) return;
    setIsLoading(true);

    await invoke<[string, string][]>("search_synonyms", {
      word: word.trim().toLowerCase(),
    })
      .then((response) => {
        return groupSynonyms(response);
      })
      .then((result) => {
        setError("");
        setSuccess(result.length > 0);
        setShowSynonyms(true);
        setSynonymGroups(result);
      })
      .catch((error) => {
        setError(error);
        setSuccess(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onInputChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    setWordInput(target.value);
    if (showSynonyms) {
      setSynonymGroups([]);
      setShowSynonyms(false);
    }
  }

  function onClear() {
    setWordInput("");
    setSynonymGroups([]);
    setShowSynonyms(false);
  }

  return {
    wordInput,
    setWordInput,
    synonymGroups,
    success,
    showSynonyms,
    isLoading,
    error,
    inputRef,
    get_synonyms,
    onInputChange,
    onClear,
  };
} 