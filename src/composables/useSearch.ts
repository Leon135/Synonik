import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";
import groupSynonyms from "../lib/groupSynonyms";
import type { SynonymGroup } from "../types/ResponseTypes";

export default function useSearch() {
  const wordInput = ref("");
  const synonymGroups = ref<SynonymGroup[]>([]);
  const isSuccess = ref(false);
  const showSynonyms = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  async function getSynonyms(word: string) {
    if (!word.trim()) return;
    isLoading.value = true;

    await invoke<[string, string][]>("search_synonyms", {
      word: word.trim().toLowerCase(),
    })
      .then((response) => {
        return groupSynonyms(response);
      })
      .then((result) => {
        errorMessage.value = "";
        isSuccess.value = result.length > 0;
        showSynonyms.value = true;
        synonymGroups.value = result;
      })
      .catch((error) => {
        errorMessage.value = String(error);
        isSuccess.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  function onInputChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    wordInput.value = target.value;
    errorMessage.value = "";
    if (showSynonyms.value) {
      synonymGroups.value = [];
      showSynonyms.value = false;
    }
  }

  function onClear() {
    wordInput.value = "";
    synonymGroups.value = [];
    showSynonyms.value = false;
    errorMessage.value = "";
  }

  return {
    wordInput,
    synonymGroups,
    isSuccess,
    showSynonyms,
    isLoading,
    errorMessage,
    inputRef,
    getSynonyms,
    onInputChange,
    onClear,
  };
}
