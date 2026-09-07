<template>
  <form class="syn-search" @submit.prevent="getSynonyms(wordInput)">
    <div class="syn-search__input-wrapper">
      <input
        ref="inputRef"
        class="syn-input"
        placeholder="Wpisz słowo..."
        aria-label="Wpisz słowo do wyszukania"
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
        <span class="syn-glyph">&#xE8BB;</span>
      </button>
    </div>
    <button type="submit" class="syn-btn" :disabled="!wordInput.trim() || isLoading">
      <WinProgressRing
        v-if="isLoading"
        :IsActive="true"
        :IsIndeterminate="true"
        :Width="16"
        :Height="16"
        Foreground="currentColor"
      />
      <span v-else class="syn-btn__glyph" aria-hidden="true">&#xE721;</span>
      Szukaj
    </button>
    <button
      type="button"
      class="syn-icon-btn"
      title="Ustawienia"
      aria-label="Ustawienia"
      @click="onOpenSettings"
    >
      <span class="syn-icon-btn__glyph">&#xE713;</span>
    </button>
  </form>

  <SynonymsList
    v-if="showSynonyms && !isLoading"
    ref="synonymsListRef"
    :success="isSuccess"
    :word="wordInput.trim()"
    :synonym-groups="synonymGroups"
  />
  <ErrorMessage v-if="errorMessage" :error="errorMessage" />
</template>

<script setup lang="ts">
  import { nextTick, ref } from "vue";
  import useSearch from "../composables/useSearch";
  import SynonymsList from "./SynonymsList.vue";
  import ErrorMessage from "./ErrorMessage.vue";
  import WinProgressRing from "../winui/components/WinProgressRing.vue";
  import useShortcuts from "../composables/useShortcuts";

  defineProps<{
    onOpenSettings: () => void;
  }>();

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

  const synonymsListRef = ref<InstanceType<typeof SynonymsList> | null>(null);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextTick(() => {
        const card = synonymsListRef.value?.$el?.querySelector(".syn-card") as HTMLElement | null;
        card?.focus();
      });
    }
  }
</script>

<style lang="css" scoped>
  .syn-search {
    display: flex;
    gap: var(--syn-space-2);
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
