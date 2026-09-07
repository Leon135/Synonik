<template>
  <fieldset ref="containerRef" class="syn-list">
    <legend class="syn-list__heading">
      Lista synonimów dla słowa <strong>{{ word }}</strong>
    </legend>
    <section v-if="!success && synonymGroups.length === 0">
      <p class="syn-list__not-found">
        Nie znaleziono synonimów dla słowa <strong>"{{ word }}"</strong>.
      </p>
    </section>
    <article
      v-for="(group, index) in synonymGroups"
      v-else
      :key="index"
      tabindex="0"
      class="syn-card"
    >
      <h3 class="syn-card__title">{{ group.group_meaning }}</h3>
      <p class="syn-card__synonyms">{{ group.synonyms.join(", ") }}</p>
    </article>
  </fieldset>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import type { SynonymGroup } from "../types/ResponseTypes";

  defineProps<{
    success: boolean;
    word: string;
    synonymGroups: SynonymGroup[];
  }>();
  const containerRef = ref<HTMLElement | null>(null);

  function focusCard(index: number) {
    const cards = containerRef.value?.querySelectorAll<HTMLElement>(".syn-card");
    if (!cards?.length) return;

    const clamped = ((index % cards.length) + cards.length) % cards.length;
    cards[clamped].focus();
  }

  function onDocumentKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement | null;
    if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
      return;
    }
    const cards = containerRef.value?.querySelectorAll<HTMLElement>(".syn-card");
    if (!cards?.length || !containerRef.value?.offsetParent) return;

    const activeIndex = Array.from(cards).indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusCard(activeIndex === -1 ? 0 : activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusCard(activeIndex === -1 ? cards.length - 1 : activeIndex - 1);
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", onDocumentKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", onDocumentKeyDown);
  });
</script>

<style lang="css" scoped>
  fieldset {
    border: 1px solid var(--surface-4);
  }

  .syn-list {
    margin-top: var(--syn-space-6);
  }

  .syn-list__heading {
    font-size: var(--syn-text-body);
    font-weight: 400;
    color: var(--text-2);
    margin-bottom: var(--syn-space-3);
    padding: 0 var(--syn-space-4);
    margin-top: 0;
  }

  .syn-list__heading strong {
    color: var(--text-1);
  }

  .syn-list__not-found {
    font-size: var(--syn-text-body);
    color: var(--text-2);
  }

  .syn-list__not-found strong {
    color: var(--text-1);
  }

  .syn-card {
    background: var(--surface-2);
    border: 1px solid var(--surface-4);
    border-radius: var(--syn-radius-card);
    padding: var(--syn-space-3) var(--syn-space-4);
    margin-bottom: var(--syn-space-2);
  }

  .syn-card:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }

  .syn-card__title {
    font-size: var(--syn-text-body);
    font-weight: var(--syn-weight-semibold);
    color: var(--text-1);
    margin: 0 0 var(--syn-space-1) 0;
  }

  .syn-card__synonyms {
    font-size: var(--syn-text-body);
    line-height: var(--syn-lineheight-body);
    color: var(--brand);
    margin: 0;
  }
</style>
