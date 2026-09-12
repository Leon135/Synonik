<script setup lang="ts">
  import useSearch from "../composables/useSearch";
  import useShortcuts from "../composables/useShortcuts";

  const {
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
  } = useSearch();
  useShortcuts(getSynonyms, wordInput, inputRef);

  function handleSubmit(): void {
    getSynonyms(wordInput.value);
  }

  function handleSelectSynonym(synonym: string): void {
    wordInput.value = synonym;
    getSynonyms(synonym);
  }
</script>

<template>
  <section aria-label="Wyszukiwanie">
    <form class="search-row" @submit.prevent="handleSubmit">
      <div class="search-field">
        <input
          ref="inputRef"
          class="search-input"
          :value="wordInput"
          placeholder="Wpisz słowo..."
          aria-label="Wpisz słowo do wyszukania"
          autocomplete="off"
          spellcheck="false"
          @input="onInputChange"
        />
        <button
          v-if="wordInput"
          type="button"
          class="search-clear"
          aria-label="Wyczyść wyszukiwanie"
          @click="onClear"
        >
          ×
        </button>
      </div>
      <button type="submit" class="search-submit" :disabled="!wordInput.trim() || isLoading">
        {{ isLoading ? "Szukanie…" : "Szukaj" }}
      </button>
    </form>

    <p v-if="isLoading" class="search-status" role="status">Szukanie…</p>
    <p v-else-if="errorMessage" class="search-status search-status--error" role="alert">
      Nie udało się wyszukać.
    </p>
    <section v-else-if="showSynonyms" aria-live="polite">
      <p v-if="!isSuccess" class="search-status">Brak synonimów dla „{{ wordInput.trim() }}”.</p>
      <div v-else>
        <p class="search-status results-heading">Lista synonimów dla „{{ wordInput.trim() }}”:</p>
        <section
          v-for="synonymGroup in synonymGroups"
          :key="synonymGroup.group_meaning"
          class="result-group"
        >
          <h2 v-if="synonymGroup.group_meaning" class="result-meaning">
            {{ synonymGroup.group_meaning }}
          </h2>
          <ul class="result-list">
            <li
              v-for="(synonym, synonymIndex) in synonymGroup.synonyms"
              :key="`${synonymGroup.group_meaning}-${synonymIndex}`"
              class="result-item"
            >
              <button type="button" class="result-word" @click="handleSelectSynonym(synonym)">
                {{ synonym }}
              </button>
            </li>
          </ul>
        </section>
      </div>
    </section>
    <p v-else class="search-status search-status--hint">Wpisz słowo i naciśnij Szukaj.</p>
  </section>
</template>
