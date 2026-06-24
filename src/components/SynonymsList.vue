<template>
  <fieldset ref="containerRef" class="syn-list">
    <p class="syn-list__heading">
      Synonimy dla słowa <strong>{{ word }}</strong
      >:
    </p>
    <section v-if="!success && synonymGroups.length === 0" class="syn-list">
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
  import hotkeys from "hotkeys-js";

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

  onMounted(() => {
    hotkeys("left,right", (event) => {
      const active = document.activeElement;
      if (!active?.closest(".syn-list")) return;

      event.preventDefault();
      const cards = containerRef.value?.querySelectorAll<HTMLElement>(".syn-card");
      if (!cards?.length) return;

      const activeIndex = Array.from(cards).indexOf(active as HTMLElement);

      if (event.key === "ArrowRight" || event.key === "Right") {
        focusCard(activeIndex + 1);
      } else if (event.key === "ArrowLeft" || event.key === "Left") {
        focusCard(activeIndex - 1);
      }
    });
  });

  onUnmounted(() => {
    hotkeys.unbind("left,right");
  });
</script>

<style lang="css" scoped>
  .syn-list {
    margin-top: var(--size-6);
  }

  .syn-list__heading {
    font-size: var(--font-size-1);
    font-weight: 400;
    color: var(--text-2);
    margin-bottom: var(--size-3);
    margin-top: 0;
  }

  .syn-list__heading strong {
    color: var(--text-1);
  }

  .syn-list__not-found {
    font-size: var(--font-size-1);
    color: var(--text-2);
  }

  .syn-list__not-found strong {
    color: var(--text-1);
  }

  .syn-card {
    background: var(--surface-2);
    border: 1px solid var(--surface-4);
    border-radius: var(--radius-2);
    padding: var(--size-2) var(--size-4);
    margin-bottom: var(--size-2);
  }

  .syn-card:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }

  .syn-card__title {
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-7);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-2);
    margin: 0 0 var(--size-1) 0;
  }

  .syn-card__synonyms {
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-3);
    color: var(--brand);
    margin: 0;
  }
</style>
