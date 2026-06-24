<template>
  <form class="syn-search" @submit.prevent="getSynonyms(wordInput)">
    <div class="syn-search__input-wrapper">
      <input
        ref="inputRef"
        class="syn-input"
        placeholder="Wpisz słowo..."
        :value="wordInput"
        @input="onInputChange"
        @keydown="onKeyDown"
      />
      <button
        v-if="wordInput"
        type="button"
        class="syn-input-clear"
        aria-label="Wyczyść"
        @click="onClear"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
    <button type="submit" class="syn-btn" :disabled="!wordInput.trim() || isLoading">
      <svg
        v-if="isLoading"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 syn-btn__icon syn-btn__icon--spin"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3a9 9 0 1 0 9 9" />
      </svg>
      <svg
        v-else
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-search syn-btn__icon"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
      Szukaj
    </button>
  </form>

  <SynonymsList
    v-if="showSynonyms && !isLoading"
    :success="isSuccess"
    :word="wordInput.trim()"
    :synonym-groups="synonymGroups"
  />
  <ErrorMessage v-if="errorMessage" :error="errorMessage" />
</template>

<script setup lang="ts">
  import useSearch from "../composables/useSearch";
  import SynonymsList from "./SynonymsList.vue";
  import ErrorMessage from "./ErrorMessage.vue";
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

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      (document.querySelector(".syn-card") as HTMLElement)?.focus();
    }
  }
</script>

<style lang="css" scoped>
  .syn-search {
    display: flex;
    gap: var(--size-2);
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .syn-search__input-wrapper {
    position: relative;
    flex: 1;
  }

  @media (max-width: 500px) {
    .syn-search__input-wrapper {
      min-width: 0;
      width: 100%;
    }

    .syn-search .syn-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
